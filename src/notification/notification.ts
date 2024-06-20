export class Notification {
    private message: string;

    private isRead: boolean;

    private time: string;

    private icon: string;

    constructor(message: string, time: string, icon: string) {
        this.message = message;
        this.isRead = false;
        this.time = time;
        this.icon = icon;
    }
}
