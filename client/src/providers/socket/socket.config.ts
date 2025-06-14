

export const SOCKET_CONFIG = {
    port: process.env.RENDER_PORT || 5000,
    host: process.env.RENDER_API || "http://localhost"
} as const;