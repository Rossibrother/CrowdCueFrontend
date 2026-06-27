import { Injectable, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Song } from '../model/song';
import { CacheService } from './cache.service';
import { WebSocketService } from './websocket.service';
import { QueueService } from './queue.service';

const QUEUE_CACHE_KEY = 'song-queue';

@Injectable({
  providedIn: 'root'
})
export class SongQueueService {
  private cacheService = inject(CacheService);
  private webSocketService = inject(WebSocketService);
  private queueService = inject(QueueService);

  readonly queue = signal<Song[]>(this.cacheService.get<Song[]>(QUEUE_CACHE_KEY) ?? []);

  constructor() {
    this.webSocketService.getSongs$()
      .pipe(takeUntilDestroyed())
      .subscribe(song => this.updateQueue([...this.queue(), song]));

    this.webSocketService.getRemovedSongs$()
      .pipe(takeUntilDestroyed())
      .subscribe(removed => this.updateQueue(
        this.queue().filter(s => s.name !== removed.name || s.artist !== removed.artist)
      ));
  }

  initialize(queueId: string): void {
    this.updateQueue([]);
    this.queueService.getQueue(queueId).subscribe({
      next: (queue) => this.updateQueue(queue.songs),
      error: (error) => console.error('Fehler beim Laden der Queue:', error)
    });
    this.webSocketService.connect(queueId);
  }

  private updateQueue(songs: Song[]): void {
    this.queue.set(songs);
    this.cacheService.set(QUEUE_CACHE_KEY, songs);
  }
}
