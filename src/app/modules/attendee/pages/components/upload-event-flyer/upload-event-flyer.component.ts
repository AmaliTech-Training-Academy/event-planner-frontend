import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from "../../../../../shared/ui/button/button.component";

@Component({
  selector: 'app-upload-event-flyer',
  imports: [ButtonComponent],
  templateUrl: './upload-event-flyer.component.html',
  styleUrl: './upload-event-flyer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class UploadEventFlyerComponent {

  public flyerPreview = input<string | null>();

  public selectedFlyer = output<Event>()

  protected onFlyerImageSelected($event: Event) {
    this.selectedFlyer.emit($event)
  }
}
