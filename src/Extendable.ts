import { IEventsManager, EventsManager } from './EventsManager'

export interface IExtendable {
  eventsManager: IEventsManager
}

export type TExtensions = {
  eventsManager?: IEventsManager
}

export class Extendable implements IExtendable {
  private _settings: TExtensions

  constructor(settings?: TExtensions) {
    if (settings) this._settings = settings
  }

  public get eventsManager(): IEventsManager {
    return this._settings ? this._settings.eventsManager : null
  }
}
