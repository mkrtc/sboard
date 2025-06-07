import { LogLevel } from "../types/log-entity.interface";



export class CreateLogDto {
    public service?: string;
    public method?: string;
    public path?: string;
    public level: LogLevel;
    public message?: string;
    public code?: string;
    public payload?: any;
    public stack?: string;
    public ip?: string;
    public start: Date;
}