import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Song } from '../model/song';
import { Queue } from '../model/queue';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private httpClient = inject(HttpClient);

  createQueue() {
    return this.httpClient.post<{ id: string }>(`${environment.apiUrl}/queues`, {});
  }

  getQueue(id: string) {
    return this.httpClient.get<Queue>(`${environment.apiUrl}/queues/${id}`);
  }

  addSong(id: string, song: Song) {
    return this.httpClient.post<Queue>(`${environment.apiUrl}/queues/${id}/songs`, song);
  }

  removeSong(id: string, song: Song) {
    return this.httpClient.delete<Queue>(`${environment.apiUrl}/queues/${id}/songs`, { body: song });
  }
}
