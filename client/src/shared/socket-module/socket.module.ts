import { io, Socket } from "socket.io-client";


export class SocketModule {
    private readonly _url: string = "http://localhost:5000";

    private readonly _socket: Socket;

    constructor(path?: string) {
        this._socket = io(this._url, {
            path,
            autoConnect: false,
            transports: ['websocket'],
            
        });
    }

    public get socket(): Socket {
        return this._socket;
    }

    public connect(): boolean {
        return this._socket.connect().connected;
    }

    public onConnect(listener: () => void): void {
        this._socket.on("connect", listener)
    }

    public onDisconnect(listener: () => void): void {
        this._socket.on("disconnect", listener)
    }

    public onEvent(event: string, listener: (...args: any[]) => void): void {
        this._socket.on(event, listener);
    }

    public offEvent(event: string, listener: (...args: any[]) => void): void {
        this._socket.off(event, listener);
    }

    public emit<T>(event: string, arg?: any[] | any, cb?: (payload: T) => void): void{
        this._socket.emit(event, arg, cb);
    }

    public send<T>(event: string, arg?: any[] | any, cb?: (payload: T) => void): void {
        this._socket.send(event, arg, cb);
    }

    public disconnect(): boolean {
        return this._socket.disconnect().connected;
    }
}