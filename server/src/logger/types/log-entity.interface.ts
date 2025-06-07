export enum LogLevel {
    INFO = 'info',
    ERROR = 'error'
}


export interface ILogEntity<P = unknown> {
    id: string;
    service?: string;
    method?: string;
    path?: string;
    level: LogLevel;
    message?: string;
    code?: string;
    payload?: P;
    stack?: string;
    ip?: string;
    created: Date;
    end?: Date;
    start?: Date;
}