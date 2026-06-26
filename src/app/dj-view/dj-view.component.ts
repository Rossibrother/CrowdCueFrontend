import { Component, inject, signal, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Song } from '../model/song';
import { WebSocketService } from '../service/websocket.service';
import { SongService } from '../service/song-service';

@Component({
  selector: 'app-dj-view',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dj-view.component.html',
  styleUrl: './dj-view.component.css'
})
export class DJViewComponent {
  private webSocketService = inject(WebSocketService);
  private songService = inject(SongService);

  songQueue = signal<Song[]>([]);

  constructor() {
    this.webSocketService.getSongs$()
      .pipe(takeUntilDestroyed())
      .subscribe(song => this.songQueue.update(queue => [...queue, song]));
  }

  removeSongFromQueue(song: Song) {
    this.songService.removeSong(song).subscribe(() => {
      this.songQueue.update(queue => queue.filter(s => s !== song));
    });
  }
}
