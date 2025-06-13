import { Controller, Get, Query } from "@nestjs/common";
import { CanvasEventService } from "./canvas-event.service";
import { FindCanvasSnapshotDto } from "./dto/find-canvas-snapshot.dto";
import { FindCanvasEventDto } from "./dto/find-canvas-event.dto";


@Controller("canvas-event")
export class CanvasEventController{


    constructor(
        private readonly canvasEventService: CanvasEventService
    ){}

    @Get()
    public async findEvents(@Query() dto: FindCanvasEventDto){
        return this.canvasEventService.findEvents(dto);
    }

    @Get("/snapshots")
    public async findSnapshots(@Query() dto: FindCanvasSnapshotDto){
        return this.canvasEventService.findSnapshots(dto);
    }

    @Get("/snapshots/events")
    public async findSnapshotsWithEvents(){
        return this.canvasEventService.findSnapshotWithEvents();
    }

}