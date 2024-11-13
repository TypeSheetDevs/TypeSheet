type NotationEventName = NotationEvent extends { name: infer N } ? N : never;

type EventParams<N extends NotationEventName> =
    Extract<NotationEvent, { name: N }> extends { params: infer P } ? P : null;

type EventHandler<T extends NotationEvent> = T extends { params: infer P }
    ? (event: CustomEvent<P>) => void
    : () => void;

type Handlers = {
    [K in NotationEvent['name']]: Extract<NotationEvent, { name: K }> extends { params: infer P }
        ? (params: P) => void
        : () => void;
};
