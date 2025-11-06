import { NgComponentOutlet } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-atendee-layout',
  standalone: true,
  imports: [RouterOutlet, NgComponentOutlet],
  templateUrl: './atendee-layout.component.html',
  styleUrl: './atendee-layout.component.scss',
})
export class AtendeeLayoutComponent {
  readonly header = signal<any | null>(null);
  readonly footer = signal<any | null>(null);

  constructor() {
    // Lazy load components in parallel
    this.loadComponents();
  }

  private async loadComponents(): Promise<void> {
    const [{ HeaderComponent }, { FooterComponent }] = await Promise.all([
      import('../../shared/components/header/header.component'),
      import('../../shared/components/footer/footer.component'),
    ]);

    this.header.set(HeaderComponent);
    this.footer.set(FooterComponent);
  }
}
