

export const SOCKET_CONFIG = {
    port: Number(process.env.NEXT_PUBLIC_RENDER_PORT) || 5000,
    host: process.env.NEXT_PUBLIC_RENDER_API || "http://localhost"
} as const;