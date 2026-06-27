import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './qr-code.component.html',
  styleUrl: './qr-code.component.css'
})
export class QrCodeComponent implements OnInit, AfterViewInit {
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  queueId = signal<string | null>(null);
  crowdViewUrl = signal<string>('');

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('queueId');
    this.queueId.set(id);
    if (id) {
      this.crowdViewUrl.set(`${window.location.origin}/crowd-view/${id}`);
    }
  }

  ngAfterViewInit(): void {
    const url = this.crowdViewUrl();
    if (url && this.qrCanvas?.nativeElement) {
      QRCode.toCanvas(this.qrCanvas.nativeElement, url, {
        width: 280,
        margin: 2,
        color: {
          dark: '#e0d0ff',
          light: '#1a1a2e'
        }
      });
    }
  }

  copyUrl(): void {
    navigator.clipboard.writeText(this.crowdViewUrl());
  }
}
