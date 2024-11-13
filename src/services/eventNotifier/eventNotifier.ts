class EventNotifier {
    static Notify<N extends NotationEventName>(
        name: N,
        ...[params]: Extract<NotationEvent, { name: N }> extends { params: infer P } ? [P] : []
    ) {
        const eventToSend = new CustomEvent(name, { detail: params ?? null });
        window.dispatchEvent(eventToSend);
    }

    static AddListener<T extends NotationEventName>(eventName: T, handler: Handlers[T]): void {
        const wrappedHandler = (event: CustomEvent) => {
            const params = event.detail as EventParams<T>;
            handler(params);
        };

        window.addEventListener(eventName, wrappedHandler as EventListener);
    }

    static RemoveListener<T extends NotationEventName>(eventName: T, handler: Handlers[T]): void {
        const wrappedHandler = (event: CustomEvent) => {
            const params = event.detail as Parameters<Handlers[T]>[0];
            handler(params);
        };

        window.removeEventListener(eventName, wrappedHandler as EventListener);
    }
}

export default EventNotifier;
