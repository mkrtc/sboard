import type { FC, UIEvent } from 'react';
import styles from "../styles/canvas.module.css";
import { HistoryListView } from './history-list.view';
import { EventEntity } from '@/entities';

interface HistoryViewProps {
    events: EventEntity[];
    selectedEventId: string;
    onClickToEvent: (event: EventEntity) => void;
    onScroll: (event: UIEvent<HTMLDivElement>) => void;
}
export const HistoryView: FC<HistoryViewProps> = ({ events, selectedEventId, onClickToEvent, onScroll }) => {
    return (
        <div className={styles.canvas_container__history} onScroll={onScroll}>
            <span className={styles.canvas_container__title}>history</span>
            <div className={styles.canvas_container__items}>
                <HistoryListView events={events} selectedEventId={selectedEventId} onClickToEvent={onClickToEvent} />
            </div>
        </div>
    );
}