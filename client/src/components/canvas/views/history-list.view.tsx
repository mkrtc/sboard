import type { FC } from 'react';
import styles from "../styles/canvas.module.css";
import { CanvasEventEntity, EventEntity } from '@/entities';

interface HistoryListViewProps {
    events: EventEntity[];
    selectedEventId: string;
    onClickToEvent: (event: EventEntity) => void;
}
export const HistoryListView: FC<HistoryListViewProps> = ({ events, selectedEventId, onClickToEvent }) => {
    return (
        <ul className={styles.canvas_container__list}>
            {events.map(event => (
                <li
                    onClick={() => onClickToEvent(event)}
                    key={event.id}
                    className={styles.canvas_container__listItem}
                >
                    <span className={styles.canvas_container__listItemTitle}>{event.created.toLocaleString("fr-CH")}</span>
                    {
                        selectedEventId === event.id &&
                        <span className={styles.canvas_container__listItemTitle}>selected</span>
                    }
                    {event.payload && <div className={styles.canvas_container__listItemBody}>
                        <span className={styles.canvas_container__listItemBodyItem}>
                            <span className={styles.canvas_container__listItemBodyKey}>"type"</span>
                            <span className={styles.canvas_container__listItemBodyDrawer}>:</span>
                            <span className={styles.canvas_container__listItemBodyValue}>{event.type}</span>
                        </span>
                        <span className={styles.canvas_container__listItemBodyItem}>
                            <span className={styles.canvas_container__listItemBodyKey}>"id"</span>
                            <span className={styles.canvas_container__listItemBodyDrawer}>:</span>
                            <span className={styles.canvas_container__listItemBodyValue}>{event.id}</span>
                        </span>
                    </div>}
                </li>
            ))}
        </ul>
    );
}