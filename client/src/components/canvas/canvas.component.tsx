"use client"
import { UIEvent, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { CanvasService } from './service/canvas.service';
import { HistoryView } from './views/history.view';
import { EventEntity } from '@/entities';
import styles from "./styles/canvas.module.css";

interface CanvasComponentProps {

}
export const CanvasComponent: FC<CanvasComponentProps> = ({ }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [events, setEvents] = useState<EventEntity[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const service = useMemo(() => new CanvasService, []);
    const lastScrollTopRef = useRef(0);

    useEffect(() => {
        if (canvasRef.current) {
            service.canvas = canvasRef.current;
        }
        (async () => {
            const events = await service.getEvents();
            setEvents(() => events);
            service.startup(async (event) => {
                setEvents((prev) => {
                    if(prev.some(ev => ev.id === event.event.id)) return prev;
                    return [event.event, ...prev];
                });
                setSelectedEventId(() => event.event.id);
            });
        })();

        return () => service.destroy();

    }, [service]);

    const onScroll = async (event: UIEvent<HTMLDivElement>) => {
        const target = event.currentTarget;

        const { scrollTop, clientHeight, scrollHeight } = target;
        const isScrollingDown = scrollTop > lastScrollTopRef.current;

        lastScrollTopRef.current = scrollTop;

        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        if (isScrollingDown && isAtBottom) {
            const newEvents = await service.getEvents({createdTo: events[events.length - 1].created.getTime(), skip: 10});
            setEvents((prev) => [...prev, ...newEvents]);
        }
    }

    return (
        <div className={styles.container}>
            <div>
                <div className={styles.btns_container}>
                    <button className={styles.btns_container__btn} onClick={() => service.createFigure()}>+ add element</button>
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
                    <HistoryView events={events} onScroll={event => onScroll(event)} selectedEventId={selectedEventId} onClickToEvent={(event) => service.replyEvent(event.id)} />
                </div>
            </div>
        </div>
    );
}