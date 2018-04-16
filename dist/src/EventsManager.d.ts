export interface IEventsManager {
    addListener: (eventName: string, cb: TEventListenerMethod) => void;
    removeListener: (eventName: string) => void;
    clearListeners: () => void;
    dispatchEvent: (methodName: string, eData: IEventData) => void;
}
export interface IEventData {
    methodArguments: any[];
}
export declare type TEventListenerMethod = (eventData: IEventData) => void;
export declare type TListenerObject = {
    [key: string]: Array<TEventListenerMethod>;
};
export declare class EventData implements IEventData {
    private _args;
    constructor(args: any[]);
    readonly methodArguments: any[];
}
export declare class EventDataAfter extends EventData implements IEventData {
    private _result;
    constructor(args: any[], result: any);
    readonly Result: any;
}
export declare class EventsManager implements IEventsManager {
    private _listeners;
    addListener(eventName: string, cb: TEventListenerMethod): void;
    removeListener(eventName: string): void;
    clearListeners(): void;
    dispatchEvent(methodName: string, eData: IEventData): void;
}
export declare function EventEmitter(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
