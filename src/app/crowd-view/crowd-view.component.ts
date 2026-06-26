import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Song } from '../model/song';
import { SongService } from '../service/song-service';
import { WebSocketService } from '../service/websocket.service';

@Component({
  selector: 'app-crowd-view',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './crowd-view.component.html',
  styleUrl: './crowd-view.component.css'
})
export class CrowdViewComponent {
  private songService = inject(SongService);
  private webSocketService = inject(WebSocketService);

  searchQuery = signal('');
  searchResults = signal<Song[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);
  errorMessage = signal('');
  queue = signal<Song[]>([]);

  constructor() {
    this.webSocketService.getSongs$()
      .pipe(takeUntilDestroyed())
      .subscribe(song => this.queue.update(q => [...q, song]));

    this.webSocketService.getRemovedSongs$()
      .pipe(takeUntilDestroyed())
      .subscribe(removed => this.queue.update(q => q.filter(s => s.name !== removed.name || s.artist !== removed.artist)));
  }

  search() {
    if (!this.searchQuery().trim()) {
      this.errorMessage.set('Bitte gib einen Songnamen ein');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.searchResults.set([]);

    this.songService.searchSongByName(this.searchQuery()).subscribe({
      next: (results) => {
        this.searchResults.set(results);
        this.hasSearched.set(true);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error searching songs:', error);
        this.errorMessage.set('Fehler bei der Suche. Bitte versuche es später erneut.');
        this.isLoading.set(false);
        this.hasSearched.set(true);
      }
    });
  }

  addSong(song: Song) {
    this.songService.addSong(song).subscribe({
      next: () => {
        this.searchQuery.set('');
        this.searchResults.set([]);
        this.hasSearched.set(false);
      },
      error: (error) => {
        console.error('Error adding song:', error);
        this.errorMessage.set('Fehler beim Hinzufügen. Bitte versuche es später erneut.');
      }
    });
  }

}
