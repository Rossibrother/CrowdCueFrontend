import { Injectable, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Song } from '../model/song';
import { Queue } from '../model/queue';
import { CacheService } from './cache.service';
import { WebSocketService } from './websocket.service';
import { QueueService } from './queue.service';

const QUEUE_ID_CACHE_KEY = 'queue-id';

@Injectable({
  providedIn: 'root'
})
export class SongQueueService {
  private cacheService = inject(CacheService);
  private webSocketService = inject(WebSocketService);
  private queueService = inject(QueueService);

  readonly queue = signal<Song[]>([]);
  private queueId = signal<string | null>(this.cacheService.get<string>(QUEUE_ID_CACHE_KEY));

  constructor() {
    const cachedId = this.cacheService.get<string>(QUEUE_ID_CACHE_KEY);
    if (cachedId) {
      this.queueService.getQueue(cachedId).subscribe({
        next: (q) => this.setQueue(q),
        error: () => this.initNewQueue()
      });
    } else {
      this.initNewQueue();
    }

    this.webSocketService.getSongs$()
      .pipe(takeUntilDestroyed())
      .subscribe(song => this.queue.update(songs => [...songs, song]));

    this.webSocketService.getRemovedSongs$()
      .pipe(takeUntilDestroyed())
      .subscribe(removed => this.queue.update(songs =>
        songs.filter(s => s.name !== removed.name || s.artist !== removed.artist)
      ));
  }

  addSong(song: Song) {
    const id = this.queueId();
    if (!id) return;
    return this.queueService.addSong(id, song).subscribe(q => this.setQueue(q));
  }

  removeSong(song: Song) {
    const id = this.queueId();
    if (!id) return;
    return this.queueService.removeSong(id, song).subscribe(q => this.setQueue(q));
  }

  private initNewQueue(): void {
    this.queueService.createQueue()
      .pipe(switchMap(({ id }) => {
        this.cacheService.set(QUEUE_ID_CACHE_KEY, id);
        this.queueId.set(id);
        return this.queueService.getQueue(id);
      }))
      .subscribe(q => this.setQueue(q));
  }

  private setQueue(q: Queue): void {
    this.queue.set(q.songs);
  }
}
