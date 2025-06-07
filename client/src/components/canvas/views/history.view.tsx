import type { FC } from 'react';
import styles from "../styles/canvas.module.css";
import { HistoryListView } from './history-list.view';
import { CanvasEventEntity } from '@/entities';

interface HistoryViewProps {
    events: CanvasEventEntity[];
    selectedEventId: string;
    onClickToEvent: (event: CanvasEventEntity) => void;
}
export const HistoryView: FC<HistoryViewProps> = ({ events, selectedEventId, onClickToEvent }) => {
    return (
        <div className={styles.canvas_container__history}>
            <span className={styles.canvas_container__title}>history</span>
            <div className={styles.canvas_container__items}>
                <HistoryListView events={events} selectedEventId={selectedEventId} onClickToEvent={onClickToEvent} />
            </div>
        </div>
    );
}