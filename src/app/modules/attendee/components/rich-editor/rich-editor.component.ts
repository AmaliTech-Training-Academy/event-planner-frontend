import { Component, input } from '@angular/core';
import { ControlContainer, FormBuilder, FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-rich-editor',
  imports: [QuillModule, ReactiveFormsModule],
  templateUrl: './rich-editor.component.html',
  styleUrl: './rich-editor.component.scss',
  // viewProviders: [
  //   {
  //     provide: ControlContainer,
  //     useExisting: FormGroupDirective
  //   }
  // ]
})
export class RichEditorComponent {
// public readonly controlName = input<string|null>(null);

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ]
  };

}
