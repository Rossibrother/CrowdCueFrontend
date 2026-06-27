import { Song } from './song';

export interface Queue {
  id: string;
  songs: Song[];
}
