import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { Song } from '../model/song';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private client: Client;
  private songSubject = new Subject<Song>();
  private songRemovedSubject = new Subject<Song>();
  private songsSubscription?: StompSubscription;
  private removedSongsSubscription?: StompSubscription;
  private currentQueueId: string | null = null;

  constructor() {
    this.client = new Client({
      brokerURL: environment.wsUrl,
      reconnectDelay: 5000,
      onConnect: () => {
        if (this.currentQueueId) {
          this.subscribeToQueueTopics(this.currentQueueId);
        }
      }
    });

    this.client.activate();
  }

  connect(queueId: string): void {
    this.currentQueueId = queueId;

    if (this.client.connected) {
      this.subscribeToQueueTopics(queueId);
    } else if (!this.client.active) {
      this.client.activate();
    }
  }

  getSongs$(): Observable<Song> {
    return this.songSubject.asObservable();
  }

  getRemovedSongs$(): Observable<Song> {
    return this.songRemovedSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromQueueTopics();
    this.client.deactivate();
  }

  private subscribeToQueueTopics(queueId: string): void {
    this.unsubscribeFromQueueTopics();

    this.songsSubscription = this.client.subscribe(`/topic/queues/${queueId}/songs`, (message: IMessage) => {
      const song: Song = JSON.parse(message.body);
      this.songSubject.next(song);
    });

    this.removedSongsSubscription = this.client.subscribe(`/topic/queues/${queueId}/songs/removed`, (message: IMessage) => {
      const song: Song = JSON.parse(message.body);
      this.songRemovedSubject.next(song);
    });
  }

  private unsubscribeFromQueueTopics(): void {
    this.songsSubscription?.unsubscribe();
    this.removedSongsSubscription?.unsubscribe();
    this.songsSubscription = undefined;
    this.removedSongsSubscription = undefined;
  }
}
