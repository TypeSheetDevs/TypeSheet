export class AudioScheduler {
    private events: Map<number, NodeJS.Timeout> = new Map();
    private nextId = 1;

    AddEvent(callback: () => void, timeout: number): number {
        const id = this.nextId++;
        const timer = setTimeout(() => {
            callback();
            this.events.delete(id);
        }, timeout);
        this.events.set(id, timer);
        return id;
    }

    RemoveEvent(id: number): void {
        const timer = this.events.get(id);
        if (timer) {
            clearTimeout(timer);
            this.events.delete(id);
        }
    }

    ClearAllEvents(): void {
        this.events.forEach(timer => clearTimeout(timer));
        this.events.clear();
    }
}
