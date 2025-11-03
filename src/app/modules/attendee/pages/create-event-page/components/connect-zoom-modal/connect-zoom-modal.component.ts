import { Component, output } from '@angular/core';
import { ModalContainerComponent } from "../../../../../../shared/components/modal-container/modal-container.component";
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";

@Component({
  selector: 'app-connect-zoom-modal',
  imports: [ModalContainerComponent, ButtonComponent],
  templateUrl: './connect-zoom-modal.component.html',
  styleUrl: './connect-zoom-modal.component.scss'
})
export class ConnectZoomModalComponent {
  public close = output<void>()
  public connect = output<void>()

  protected connectZoom() {
    this.connect.emit()
  }
  
  protected toggleConnectZoomModal() {
    this.connect.emit()
  }

}
