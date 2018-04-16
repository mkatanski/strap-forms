import { IEventsManager } from './EventsManager';
export interface IExtendable {
    eventsManager: IEventsManager;
}
export declare type TExtensions = {
    eventsManager?: IEventsManager;
};
export declare class Extendable implements IExtendable {
    private _settings;
    constructor(settings?: TExtensions);
    readonly eventsManager: IEventsManager;
}
