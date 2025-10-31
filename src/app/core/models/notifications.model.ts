export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export interface Notification {
    type: NotificationType;
    message: string;
    duration?: number;
}