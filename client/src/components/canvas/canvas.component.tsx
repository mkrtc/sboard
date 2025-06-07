"use client"
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { CanvasService } from './service/canvas.service';
import styles from "./styles/canvas.module.css";
import { HistoryView } from './views/history.view';
import { CanvasEventEntity } from '@/entities';

interface CanvasComponentProps {

}
export const CanvasComponent: FC<CanvasComponentProps> = ({ }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [events, setEvents] = useState<CanvasEventEntity[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const service = useMemo(() => new CanvasService, []);

    useEffect(() => {
        if (canvasRef.current) {
            service.canvas = canvasRef.current;
        }
        (async () => {
            const events = await service.getEvents();
            setEvents(() => events);
            setSelectedEventId(() => events[0].id || '');
            
            service.addEvent(events[0]);
            service.startup(events[0], async () => {
                const events = await service.getEvents();
                setSelectedEventId(() => events[0].id || '');
                setEvents(() => events);
            });
        })();

        return () => service.destroy();

    }, [service]);

    const selectEvent = (event: CanvasEventEntity) => {
        setSelectedEventId(() => event.id);
        service.getEventById(event.id);
    }

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.btns_container}>
                    <button className={styles.btns_container__btn} onClick={() => service.addSquare()}>+ add element</button>
                    <button className={styles.btns_container__btn} onClick={() => service.clear()}>clear</button>
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
                    <HistoryView events={events} selectedEventId={selectedEventId} onClickToEvent={selectEvent}/>
                </div>
            </div>
        </div>
    );
}