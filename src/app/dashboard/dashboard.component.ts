import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QueueService } from '../service/queue.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private queueService = inject(QueueService);
  private router = inject(Router);

  isCreating = false;

  createQueue() {
    this.isCreating = true;
    this.queueService.createQueue().subscribe({
      next: (queue) => this.router.navigate(['/dj-view', queue.id]),
      error: (err) => {
        console.error('Fehler beim Erstellen der Queue:', err);
        this.isCreating = false;
      }
    });
  }
}
