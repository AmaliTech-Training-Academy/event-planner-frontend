import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-upload-event-flyer',
  imports: [ButtonComponent, NgOptimizedImage],
  templateUrl: './upload-event-flyer.component.html',
  styleUrl: './upload-event-flyer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class UploadEventFlyerComponent {

  public readonly flyerPreview = input<string | null>();
  public readonly title = input<string|null>()

  public selectedFlyer = output<Event>()

  protected onFlyerImageSelected($event: Event) {
    this.selectedFlyer.emit($event)
  }
}
