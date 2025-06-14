

export const SOCKET_CONFIG = {
    port: Number(process.env.RENDER_PORT) || 5000,
    host: process.env.RENDER_API || "http://localhost"
} as const;