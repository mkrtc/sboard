import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/database/database.module";
import { LogEntity } from "src/logger/entities/log.entity";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ApiInterceptor } from "src/api/api.interceptor";
import { ApiFilter } from "src/api/api.filter";
import { CanvasEventEntity } from "src/canvas-event/entities/canvas-event.entity";


export async function createTestModule(metadata: ModuleMetadata) {
    return await Test.createTestingModule({
        ...metadata,
        providers: [
            {
                provide: APP_INTERCEPTOR,
                useClass: ApiInterceptor
            },
            {
                provide: APP_FILTER,
                useClass: ApiFilter
            },
            ...(metadata.providers || []),
        ],
        imports: [
            ConfigModule.forRoot({ envFilePath: ".env" }),
            DatabaseModule.register([
                LogEntity, CanvasEventEntity
            ]),
            ...(metadata.imports || []),
        ]
    }).compile();
}