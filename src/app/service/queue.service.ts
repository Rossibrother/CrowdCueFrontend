import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Song } from '../model/song';

@Injectable({ providedIn: 'root' })
export class QueueService {
  private http = inject(HttpClient);

  createQueue() {
    return this.http.post<{ id: string }>(`${environment.apiUrl}/queues`, {});
  }

  getQueue(id: string) {
    return this.http.get<{ id: string; songs: Song[] }>(`${environment.apiUrl}/queues/${id}`);
  }
}
