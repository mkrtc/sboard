import type { FC } from 'react';
import styles from "../styles/canvas.module.css";
import { HistoryListView } from './history-list.view';
import { EventEntity } from '@/entities';

interface HistoryViewProps {
    events: EventEntity[];
}
export const HistoryView: FC<HistoryViewProps> = ({ events }) => {
    return (
        <div className={styles.canvas_container__history}>
            <span className={styles.canvas_container__title}>history</span>
            <div>
                <HistoryListView events={events} />
            </div>
        </div>
    );
}