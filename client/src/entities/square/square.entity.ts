
interface ISquareEntity {
    readonly id: string
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}


export class SquareEntity {
    public readonly id!: string
    public x!: number;
    public y!: number;
    public width!: number;
    public height!: number;
    public color!: string;
    
    constructor(square: ISquareEntity) {
        Object.assign(this, square);
    }

}