import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import { Song } from '../model/song';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private client: Client;
  private songSubject = new Subject<Song>();
  private songRemovedSubject = new Subject<Song>();

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      onConnect: () => {
        this.client.subscribe('/topic/songs', (message: IMessage) => {
          const song: Song = JSON.parse(message.body);
          this.songSubject.next(song);
        });
        this.client.subscribe('/topic/songs/removed', (message: IMessage) => {
          const song: Song = JSON.parse(message.body);
          this.songRemovedSubject.next(song);
        });
      }
    });

    this.client.activate();
  }

  getSongs$(): Observable<Song> {
    return this.songSubject.asObservable();
  }

  getRemovedSongs$(): Observable<Song> {
    return this.songRemovedSubject.asObservable();
  }

  ngOnDestroy(): void {
    this.client.deactivate();
  }
}
