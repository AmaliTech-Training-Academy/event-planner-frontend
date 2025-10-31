import { Component } from '@angular/core';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { CommonModule } from '@angular/common';
import { VenueLayoutEditorComponent } from "../../components/venue-layout-editor/venue-layout-editor.component";
import { InputComponent } from "../../../../shared/ui/input/input.component";
import { RichEditorComponent } from "../../components/rich-editor/rich-editor.component";

interface Section {
  name: string;
  capacity: number;
  price: number;
  color: string;
}

@Component({
  selector: 'app-define-venue',
  imports: [ButtonComponent, CommonModule, VenueLayoutEditorComponent, InputComponent, RichEditorComponent],
  templateUrl: './define-venue.component.html',
  styleUrl: './define-venue.component.scss'
})
export class DefineVenueComponent {

  definedSections: Section[] = [
    { name: 'VIP', capacity: 100, price: 50, color: '#f55d3b' },
    { name: 'VIP', capacity: 100, price: 50, color: '#f59d3b' },
  ];


  tools = [
    {
      name: 'rectangle',
      icon: 'icons/rectangle-tool-icon.svg'
    },
    {
      name: 'polygon',
      icon: 'icons/polygon-tool-icon.svg'
    },
    {
      name: 'circle',
      icon: 'icons/circle-tool-icon.svg'
    }
  ]

}
