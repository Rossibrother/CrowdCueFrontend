import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from '../model/song';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private httpClient = inject(HttpClient);

  searchSongByName(songName: string) {
    return this.httpClient.get<Song[]>(`${environment.apiUrl}/songs/search/${encodeURIComponent(songName)}`);
  }

  addSong(song: Song, queueId: string) {
    return this.httpClient.post<Song>(`${environment.apiUrl}/queues/${queueId}/songs/add`, song);
  }

  removeSong(song: Song, queueId: string) {
    return this.httpClient.delete<Song>(`${environment.apiUrl}/queues/${queueId}/songs/remove`, { body: song });
  }
}
