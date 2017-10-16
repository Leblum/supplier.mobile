import { NotificationType } from "../enumerations";

export interface IMessage {
    title?: string,
    text: string,
    notificationType: NotificationType
}