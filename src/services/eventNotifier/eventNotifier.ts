class EventNotifier {
    private static handlerMap = new Map<string, (e: Event) => void>();

    private static CreateKey<T extends NotationEventName>(
        eventName: T,
        handler: Handlers[T],
    ): string {
        return `${eventName}-${handler.toString()}`;
    }

    static Notify<N extends NotationEventName>(
        name: N,
        ...[params]: Extract<NotationEvent, { name: N }> extends { params: infer P } ? [P] : []
    ) {
        const eventToSend = new CustomEvent(name, { detail: params ?? null });
        window.dispatchEvent(eventToSend);
    }

    static AddListener<T extends NotationEventName>(eventName: T, handler: Handlers[T]): void {
        const key = EventNotifier.CreateKey(eventName, handler);

        const wrappedHandler = (event: Event) => {
            const customEvent = event as CustomEvent;
            const params = customEvent.detail as EventParams<T>;
            handler(params);
        };

        window.addEventListener(eventName, wrappedHandler);
        this.handlerMap.set(key, wrappedHandler);
    }

    static RemoveListener<T extends NotationEventName>(eventName: T, handler: Handlers[T]): void {
        const key = EventNotifier.CreateKey(eventName, handler);
        const wrappedHandler = this.handlerMap.get(key);

        if (!wrappedHandler) {
            return;
        }

        window.removeEventListener(eventName, wrappedHandler);
        this.handlerMap.delete(key);
    }
}

export default EventNotifier;
