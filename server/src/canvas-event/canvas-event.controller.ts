import { Controller, Get } from "@nestjs/common";
import { CanvasEventService } from "./canvas-event.service";


@Controller("canvas-event")
export class CanvasEventController{


    constructor(
        private readonly canvasEventService: CanvasEventService
    ){}

    @Get()
    public findAll(){
        return this.canvasEventService.getAll();
    }
}