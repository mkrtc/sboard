"use client"
import { useEffect, useMemo, type FC } from 'react';
import { CanvasService } from './service/canvas.service';

interface CanvasComponentProps {

}
export const CanvasComponent: FC<CanvasComponentProps> = ({ }) => {
    const service = useMemo(() => new CanvasService, []);

    useEffect(() => {
        service.connect();
        service.onConnect();
        service.send();
        service.onMessage();


        return () => {
            service.disconnect();
        }
    }, [service]);


    return (
        <></>
    );
}