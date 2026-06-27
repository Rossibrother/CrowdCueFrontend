import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Song } from '../model/song';
import { SongService } from '../service/song-service';
import { SongQueueService } from '../service/song-queue.service';

@Component({
  selector: 'app-dj-view',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dj-view.component.html',
  styleUrl: './dj-view.component.css'
})
export class DJViewComponent {
  private songService = inject(SongService);
  private songQueueService = inject(SongQueueService);

  readonly songQueue = this.songQueueService.queue;

  removeSongFromQueue(song: Song) {
    this.songService.removeSong(song).subscribe();
  }
}
