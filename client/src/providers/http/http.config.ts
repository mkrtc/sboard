

export const HTTP_CONFIG = {
    baseUrl: process.env.RENDER_API || "http://localhost",
    port: Number(process.env.RENDER_PORT) || 5000,
    paths: {
        canvasEvent: {
            find: "/canvas-event"
        }
    }
} as const;