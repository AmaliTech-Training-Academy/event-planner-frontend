import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly isOpen: boolean;
}

@Component({
  selector: 'app-faq-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSectionComponent {
  protected readonly _title = signal<string>('Frequently Asked Questions');
  protected readonly _subtitle = signal<string>(
    'Discover amazing destinations, find the best flights and hotels, and create memorable travel experiences with our all-in-one travel platform.'
  );

  private readonly initialFaqs: readonly FaqItem[] = [
    {
      id: '1',
      question: 'How does this platform work?',
      answer:
        'Our platform provides a seamless experience for creating and managing events. Simply sign up, create your event, customize it to your needs, and share it with your audience. We handle all the technical details so you can focus on what matters most - your event.',
      isOpen: false,
    },
    {
      id: '2',
      question: 'Do I need an account to make a booking?',
      answer:
        'Yes, you need to create a free account to make bookings and manage your events. This allows us to provide you with a personalized experience, save your preferences, and keep track of your event history. Registration only takes a few minutes.',
      isOpen: false,
    },
    {
      id: '3',
      question: 'Can I book a flight for someone else?',
      answer:
        'Absolutely! You can book events and tickets for other people. During the booking process, you can enter their information as the attendee while using your account for payment and management. This is perfect for gifting tickets or organizing group events.',
      isOpen: false,
    },
  ];

  protected readonly _faqs = signal<readonly FaqItem[]>(this.initialFaqs);
  protected readonly _openFaqCount = computed(
    () => this._faqs().filter((faq) => faq.isOpen).length
  );

  protected _toggleFaq(id: string): void {
    this._faqs.update((faqs) =>
      faqs.map((faq) => ({
        ...faq,
        isOpen: faq.id === id ? !faq.isOpen : faq.isOpen,
      }))
    );
  }

  protected _trackByFaqId(index: number, item: FaqItem): string {
    return item.id;
  }
}
