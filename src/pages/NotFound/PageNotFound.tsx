import * as React from "react";
import { Box, Typography } from "@mui/material";
import { styled, keyframes, alpha } from "@mui/material/styles";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const Center = styled(Box)(({ theme }) => ({
    display: "grid",
    placeItems: "center",
    gap: theme.spacing(3),
    textAlign: "center",
    padding: theme.spacing(4),
}));

const IllustrationWrap = styled(Box)(({ theme }) => ({
    width: "min(380px, 80vw)",
    aspectRatio: "1/1",
    display: "grid",
    placeItems: "center",
    animation: `${float} 6s ease-in-out infinite`,
    filter:
        theme.palette.mode === "dark"
            ? "drop-shadow(0 8px 20px rgba(0,0,0,.6))"
            : "drop-shadow(0 8px 20px rgba(0,0,0,.15))",
}));

const CodeBadge = styled(Box)(({ theme }) => ({
    fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: 10,
    background: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    border: `1px dashed ${alpha(theme.palette.primary.main, 0.35)}`,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
}));

const DefaultIllustration = () => (
    <svg viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lost astronaut illustration" style={{ width: "100%", height: "100%" }}>
        <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7c4dff"/>
                <stop offset="100%" stopColor="#00bcd4"/>
            </linearGradient>
        </defs>
        <circle cx="260" cy="260" r="220" fill="url(#g1)" opacity="0.12"/>
        <g transform="translate(90,60)">
            <ellipse cx="230" cy="380" rx="160" ry="24" fill="#000" opacity="0.08"/>
            <g>
                <rect x="140" y="40" width="160" height="200" rx="28" fill="#fff" opacity="0.9"/>
                <rect x="168" y="70" width="104" height="50" rx="10" fill="#e3f2fd"/>
                <rect x="168" y="130" width="104" height="80" rx="12" fill="#f3e5f5"/>
                <circle cx="198" cy="173" r="10" fill="#7e57c2"/>
                <circle cx="242" cy="173" r="10" fill="#26c6da"/>
                <circle cx="222" cy="103" r="6" fill="#42a5f5"/>
            </g>
            <g transform="translate(60,160)">
                <path d="M20 60 C 20 20, 120 20, 120 60 S 220 100, 220 60" fill="none" stroke="#b39ddb" strokeWidth="8" strokeLinecap="round"/>
                <circle cx="18" cy="60" r="10" fill="#9575cd"/>
                <circle cx="120" cy="60" r="10" fill="#9575cd"/>
                <circle cx="222" cy="60" r="10" fill="#9575cd"/>
            </g>
            <g transform="translate(110,230)">
                <circle cx="0" cy="0" r="18" fill="#00bcd4"/>
                <circle cx="180" cy="0" r="18" fill="#7c4dff"/>
                <rect x="12" y="-6" width="156" height="12" rx="6" fill="#80deea"/>
            </g>
        </g>
    </svg>
);

export default function PageNotFound() {
    return (
        <Center>
            <CodeBadge>
                <span aria-hidden>/* 404 */</span>
                <span>Page not found</span>
            </CodeBadge>

            <IllustrationWrap aria-hidden>
                <DefaultIllustration />
            </IllustrationWrap>

            <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: 0.2 }}>
                It seems that you are lost
            </Typography>
            <Typography variant="body1" color="text.secondary">
                Click the logo to get back to the homepage.
            </Typography>
        </Center>
    );
}
