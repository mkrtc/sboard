import type { FC } from 'react';
import styles from "../styles/canvas.module.css";
import { EventEntity } from '@/entities';

interface HistoryListViewProps {
    events: EventEntity[];
}
export const HistoryListView: FC<HistoryListViewProps> = ({ events }) => {
    return (
        <ul className={styles.canvas_container__list}>
            {events.map(event => (
                <li key={event.id} className={styles.canvas_container__listItem}>
                    <span className={styles.canvas_container__listItemTitle}>{event.created.toLocaleString("fr-CH")}</span>
                    {event.data && <div className={styles.canvas_container__listItemBody}>
                        <span className={styles.canvas_container__listItemBodyItem}>
                            <span className={styles.canvas_container__listItemBodyKey}>"x"</span>
                            <span className={styles.canvas_container__listItemBodyDrawer}>:</span>
                            <span className={styles.canvas_container__listItemBodyValue}>10</span>
                        </span>
                        <span className={styles.canvas_container__listItemBodyItem}>
                            <span className={styles.canvas_container__listItemBodyKey}>"y"</span>
                            <span className={styles.canvas_container__listItemBodyDrawer}>:</span>
                            <span className={styles.canvas_container__listItemBodyValue}>10</span>
                        </span>
                    </div>}
                </li>
            ))}
        </ul>
    );
}