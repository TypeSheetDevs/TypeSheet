import { NotationEvent } from '@services/eventNotifier/event.types';

export type NotationEventName = NotationEvent extends { name: infer N } ? N : never;

export type EventParams<N extends NotationEventName> =
    Extract<NotationEvent, { name: N }> extends { params: infer P } ? P : null;

export type EventHandler<T extends NotationEvent> = T extends { params: infer P }
    ? (event: CustomEvent<P>) => void
    : () => void;

export type Handlers = {
    [K in NotationEvent['name']]: Extract<NotationEvent, { name: K }> extends { params: infer P }
        ? (params: P) => void
        : () => void;
};
