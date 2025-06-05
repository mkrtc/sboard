import { SocketModule } from "@/shared";
import { SquareEntity } from "../square/square.entity";



interface IEventEntity {
    id: string;
    type: string;
    data: SquareEntity[];
    created: string;
}


export class EventEntity {
    public id!: string;
    public type!: string;
    public data!: SquareEntity[];
    public created!: Date;

    constructor(event: IEventEntity) {
        const created = new Date(event.created);
        Object.assign(this, { ...event, created });
    }

    public static createRandomSquare(socketModule: SocketModule, event: EventEntity | null) {
        const colors = ["red", "green", "blue", "yellow", "purple", "orange", "pink", "brown", "black", "white"];

        const square = new SquareEntity({
            id: Math.random().toString(36).substring(2, 15),
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            color: colors[Math.floor(Math.random() * colors.length)]
        });

        // return socket.createSquare();
        const data = [...event?.data || [], square];
        const eventEntity = new EventEntity({
            created: new Date().toISOString(),
            data,
            id: Math.random().toString(36).substring(2, 15),
            type: "create::square"
        });
        socketModule.emit("createEvent", eventEntity, () => {});
    }
}