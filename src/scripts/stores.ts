import { map } from 'nanostores';

export interface SyncTabs {
  [key: string]: number;
}

export const syncTabs = map<SyncTabs>();
