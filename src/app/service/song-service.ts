import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Song} from '../model/song';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  private httpClient = inject(HttpClient);

  searchSongByName(songName: string) {
    return this.httpClient.get<Song[]>(`${environment.apiUrl}/songs/search/${encodeURIComponent(songName)}`);
  }

}
