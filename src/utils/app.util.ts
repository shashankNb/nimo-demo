export const AppConstants = {
    apiBasePath: import.meta.env.VITE_API_BASE_URL
}

type FormatType = 'currency' | 'decimal' | 'percent' | 'unit';

interface FormatOptions {
    type?: FormatType;
    currency?: string;
    unit?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}

export function formatNumber(
    value: number,
    {
        type = 'decimal',
        currency = 'USD',
        unit = 'kilobyte',
        locale = 'en-US',
        minimumFractionDigits,
        maximumFractionDigits
    }: FormatOptions = {}
): string {
    const options: Intl.NumberFormatOptions = {
        style: type,
        currency: type === 'currency' ? currency : undefined,
        unit: type === 'unit' ? unit : undefined,
        unitDisplay: type === 'unit' ? 'short' : undefined,
        minimumFractionDigits,
        maximumFractionDigits
    };

    return new Intl.NumberFormat(locale, options).format(value);
}