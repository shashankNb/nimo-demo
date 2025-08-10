import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

const MIN_GAP_MS = 3000;
const TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;
const IDEMPOTENT = new Set(["get", "head", "options"] as const);

const _axios: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,  // https://api.coingecko.com/api/v3
    headers: {
        "Content-Type": "application/json",
        "x-cg-demo-api-key": import.meta.env.VITE_API_COIN_TOKEN
    },
    timeout: TIMEOUT_MS,
    transitional: { clarifyTimeoutError: true },
});

declare module "axios" {
    export interface AxiosRequestConfig {
        rateLimit?: boolean;
    }
}

let lastStart = 0;
let queue = Promise.resolve();

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function throttleStart(): Promise<void> {
    const now = Date.now();
    const scheduled = Math.max(now, lastStart + MIN_GAP_MS);
    const wait = scheduled - now;
    if (wait > 0) await sleep(wait);
    lastStart = scheduled;
}

function enqueueThrottle() {
    queue = queue.then(throttleStart);
    return queue;
}

export function parseRetryAfter(header?: string): number | null {
    if (!header) return null;
    const secs = Number(header);
    if (!Number.isNaN(secs)) return Math.max(0, secs * 1000);
    const date = Date.parse(header);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
    return null;
}

export function jitterBackoff(attempt: number): number {
    const base = 1000 * Math.pow(2, attempt);
    const max = base * 3;
    return Math.floor(base + Math.random() * (max - base));
}

_axios.interceptors.request.use(
    async (config) => {
        const shouldRateLimit = config.rateLimit !== false;
        if (shouldRateLimit) {
            await enqueueThrottle();
        }
        return config;
    },
    (error) => Promise.reject(error)
);

_axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError & { config?: AxiosRequestConfig & { __retryCount?: number } }) => {
        const { response, config } = error;

        if (response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("LOGIN_KEY");
                window.location.href = "/auth/login";
            }
            return Promise.reject(error);
        }

        const status = response?.status;
        const method = (config?.method || "get").toLowerCase();
        const canRetry = status === 429 && config && IDEMPOTENT.has(method as any);

        if (canRetry) {
            config.__retryCount = (config.__retryCount || 0) + 1;
            if (config.__retryCount <= MAX_RETRIES) {
                const headerDelay = parseRetryAfter(response?.headers?.["retry-after"]);
                const wait = headerDelay ?? jitterBackoff(config.__retryCount);
                await sleep(wait);
                return _axios(config);
            }
        }

        if (error.code === "ECONNABORTED") {
            error.message = `Request timed out after ${TIMEOUT_MS}ms`;
        }

        return Promise.reject(error);
    }
);

export default _axios;