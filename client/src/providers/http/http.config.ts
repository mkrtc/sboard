

export const HTTP_CONFIG = {
    baseUrl: process.env.NEXT_PUBLIC_RENDER_API || "http://localhost",
    port: Number(process.env.NEXT_PUBLIC_RENDER_PORT) || 5000,
    paths: {
        canvasEvent: {
            find: "/canvas-event"
        }
    }
} as const;