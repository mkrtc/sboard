import { SocketModule } from "@/shared";
import { io, Socket } from "socket.io-client";


export class CanvasService{
    private readonly _path: string = "/ws/events";
    private _connected: boolean = false;

    private readonly socketModule: SocketModule;

    constructor(){
        this.socketModule = new SocketModule(this._path);
    }

    public get connected(): boolean {
        return this._connected;
    }

    public connect(): void {
        this._connected = this.socketModule.connect();
    }

    public disconnect(): void {
        this.socketModule.disconnect();
    }

    public onConnect(){
        this.socketModule.onConnect(() => {
            console.log("Connected to server");
        })
    }

    public emit(){
        this.socketModule.emit("message", {hello: "world2"}, value => {
            console.log("emit", value);
        });
    }

    public send(){
        this.socketModule.send("message", {hello: "world"}, value => {
            console.log("send", value);
        });
    }

    public onMessage(){
        this.socketModule.onEvent("message", (data: any) => {
            console.log(data);
        })
    }


}