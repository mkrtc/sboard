"use client"
import { UIEvent, use, useEffect, useMemo, useRef, useState, useSyncExternalStore, type FC } from 'react';
import { CanvasService } from './service/canvas.service';
import { HistoryView } from './views/HistoryView';
import { EventEntity } from '@/entities';
import styles from "./styles/canvas.module.css";
import { CanvasException } from '@/repositories';

interface SnapshotNotFoundException {
    data: string;
    pattern: string;
}


type TCanvasException = CanvasException<SnapshotNotFoundException>;

interface CanvasComponentProps {

}
export const CanvasComponent: FC<CanvasComponentProps> = ({ }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [events, setEvents] = useState<EventEntity[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [error, setError] = useState<TCanvasException | null>(null);

    const service = useMemo(() => new CanvasService, []);
    const lastScrollTopRef = useRef(0);

    useEffect(() => {
        if (canvasRef.current) {
            service.canvas = canvasRef.current;
        }
        (async () => {
            const events = await service.getEvents();
            setEvents(() => events);
            service.startup(async (eventEntity) => {
                const event = eventEntity.event;
                if (event) {
                    setEvents((prev) => prev.some(ev => ev.id === event.id) ? prev : [event, ...prev]);
                    setSelectedEventId(() => event.id);
                }
            });

            service.onError<TCanvasException>(error => {
                setError(() => error);
            })
        })();

        return () => service.destroy();

    }, [service]);

    const onScroll = async (event: UIEvent<HTMLDivElement>) => {
        const newEvents = await service.onHistoryScroll(event, { createdTo: events[events.length - 1].created.getTime() });
        if (newEvents.length) {
            setEvents((prev) => [...prev, ...newEvents]);
        }
        // const target = event.currentTarget;

        // const { scrollTop, clientHeight, scrollHeight } = target;
        // const isScrollingDown = scrollTop > lastScrollTopRef.current;

        // lastScrollTopRef.current = scrollTop;

        // const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        // if (isScrollingDown && isAtBottom) {
        //     const newEvents = await service.getEvents({ createdTo: events[events.length - 1].created.getTime(), skip: 10 });
        //     setEvents((prev) => [...prev, ...newEvents]);
        // }
    }
    return (
        <div className={styles.container}>
            <div>
                {error &&
                    <div onClick={() => setError(() => null)} className={styles.error_container}>
                        <span className={styles.error_message}>{error.message}</span>
                        {/* <span className={styles.error_cause}>{error?.cause?.data}</span> */}
                    </div>
                }
                <div className={styles.btns_container}>
                    <button className={styles.btns_container__btn} onClick={() => service.createFigure()}>+ add element</button>
                    <button className={styles.btns_container__btn} onClick={() => service.clearCanvas()}>clear</button>
                </div>
                <div className={styles.double_click_container}>
                    <span className={styles.double_click}>double click to remove element</span>
                </div>
                <div className={styles.canvas_container}>
                    <canvas
                        ref={canvasRef}
                        width={1020}
                        height={600}
                        className={styles.canvas}
                        onMouseDown={event => service.selectFigure(event)}
                        onMouseUp={() => service.saveFigurePosition()}
                        onMouseMove={event => service.moveFigure(event)}
                        onDoubleClick={event => service.deleteFigure(event)}
                    />
                    <HistoryView events={events} onScroll={onScroll} selectedEventId={selectedEventId} onClickToEvent={(event) => service.replyEvent(event.id)} />
                </div>
            </div>
        </div>
    );
}