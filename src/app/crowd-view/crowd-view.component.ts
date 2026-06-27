import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Song } from '../model/song';
import { SongService } from '../service/song-service';
import { SongQueueService } from '../service/song-queue.service';

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
  private songQueueService = inject(SongQueueService);

  searchQuery = signal('');
  searchResults = signal<Song[]>([]);
  isLoading = signal(false);
  hasSearched = signal(false);
  errorMessage = signal('');

  readonly queue = this.songQueueService.queue;

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
    this.songQueueService.addSong(song);
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.hasSearched.set(false);
  }
}
