import { Component, input, output } from '@angular/core';
import { ButtonComponent } from "../../ui/button/button.component";

@Component({
  selector: 'app-empty-list-message',
  imports: [ButtonComponent],
  templateUrl: './empty-list-message.component.html',
  styleUrl: './empty-list-message.component.scss'
})
export class EmptyListMessageComponent {
  public actionText = input<string>('')
  public title = input<string>('')
  public descrition = input<string>('')
  public secondaryText = input<string>('')
  public handleAction = output<void>()
  public handleSecondary = output<void>()


  protected handleActionPress() {
    this.handleAction.emit()
  }

  protected handleSecondaryPress() {
    this.handleSecondary.emit()
  }
}
