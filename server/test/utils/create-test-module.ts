import { Test } from "@nestjs/testing";
import { ModuleMetadata } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "src/database/database.module";
import { CanvasEventEntity } from "src/canvas-event/entities/canvas-event.entity";
import { CanvasSnapshotEntity } from "src/canvas-event/entities/canvas-snapshot.entity";


export async function createTestModule(metadata: ModuleMetadata) {
    return await Test.createTestingModule({
        ...metadata,
        providers: [
            ...(metadata.providers || []),
        ],
        imports: [
            ConfigModule.forRoot({ envFilePath: "../.env" }),
            DatabaseModule.register([
                CanvasEventEntity, CanvasSnapshotEntity
            ]),
            ...(metadata.imports || []),
        ]
    }).compile();
}