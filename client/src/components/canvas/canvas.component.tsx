"use client"
import { useEffect, useMemo, useRef, type FC } from 'react';
import { CanvasService } from './service/canvas.service';
import styles from "./styles/canvas.module.css";
import { HistoryView } from './views/history.view';

interface CanvasComponentProps {

}
export const CanvasComponent: FC<CanvasComponentProps> = ({ }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const service = useMemo(() => new CanvasService, []);

    useEffect(() => {
        if (canvasRef.current) {
            service.canvas = canvasRef.current;
        }
        service.addEvents([]);
        service.startup();

        return () => service.destroy();

    }, [service]);


    return (
        <div className={styles.container}>
            <div>
                <div className={styles.btns_container}>
                    <button className={styles.btns_container__btn} onClick={() => service.addElement()}>+ add element</button>
                </div>
                <div className={styles.canvas_container}>
                    <canvas
                        ref={canvasRef}
                        width={1020}
                        height={600}
                        className={styles.canvas}
                        onMouseDown={event => service.onMouseDown(event)}
                        onMouseUp={event => service.onMouseUp(event)}
                        onMouseMove={event => service.onMouseMove(event)}
                    />
                    <HistoryView events={[]}/>
                </div>
            </div>
        </div>
    );
}