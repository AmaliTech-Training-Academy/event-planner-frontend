import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-rich-editor',
  imports: [QuillModule, ReactiveFormsModule],
  templateUrl: './rich-editor.component.html',
  styleUrl: './rich-editor.component.scss',
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichEditorComponent {
public readonly controlName = input<string>('');

quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ align: '' }, { align: 'center' }, { align: 'right' }],
    [{ list: 'bullet' }, { list: 'ordered' }],
  ],
};

}
