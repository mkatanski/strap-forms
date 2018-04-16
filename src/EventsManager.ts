export interface IEventsManager {
  addListener: (eventName: string, cb: TEventListenerMethod) => void
  removeListener: (eventName: string) => void
  clearListeners: () => void
  dispatchEvent: (methodName: string, eData: IEventData) => void
}

export interface IEventData {
  methodArguments: any[]
}

export type TEventListenerMethod = (eventData: IEventData) => void

export type TListenerObject = {
  [key: string]: Array<TEventListenerMethod>,
}

export class EventData implements IEventData {
  private _args: any[]

  constructor(args: any[]) {
    this._args = args
  }

  public get methodArguments(): any[] {
    return this._args
  }
}

export class EventDataAfter extends EventData implements IEventData {
  private _result: any

  constructor(args: any[], result: any) {
    super(args)
    this._result = result
  }

  public get Result(): any {
    return this._result
  }
}

export class EventsManager implements IEventsManager {
  private _listeners: TListenerObject = {}

  public addListener(eventName: string, cb: TEventListenerMethod): void {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = []
    }
    this._listeners[eventName].push(cb)
  }

  public removeListener(eventName: string): void {
    delete this._listeners[eventName]
  }

  public clearListeners(): void {
    this._listeners = {}
  }

  public dispatchEvent(methodName: string, eData: IEventData): void {
    let listeners

    if (eData instanceof EventData) {
      listeners = this._listeners[`on_before_${methodName}`]
    }

    if (eData instanceof EventDataAfter) {
      listeners = this._listeners[`on_after_${methodName}`]
    }

    if (!listeners) return

    listeners.forEach((listenerMethod) => {
      listenerMethod(eData)
      console.log(eData)
    })
  }
}

export function EventEmitter(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  var originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    this.eventsManager && this.eventsManager.dispatchEvent(propertyKey, new EventData(args))
    const result = originalMethod.apply(this, args)
    this.eventsManager && this.eventsManager.dispatchEvent(propertyKey, new EventDataAfter(args, result))

    return result
  }

  return descriptor;
}

