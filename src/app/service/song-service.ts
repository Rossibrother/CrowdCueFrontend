import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Song} from '../model/song';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private httpClient = inject(HttpClient);


  searchSongByName(songName: string) {
    return this.httpClient.get<Song[]>(`http://localhost:8080/songs/search/${encodeURIComponent(songName)}`);
  }

  addSong(song: Song) {
    return this.httpClient.post<Song>('http://localhost:8080/songs/add', song);
  }

  removeSong(song: Song) {
    return this.httpClient.delete<Song>('http://localhost:8080/songs/remove', { body: song });
  }

}
