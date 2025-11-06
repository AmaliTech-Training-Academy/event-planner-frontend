import { CommonModule } from '@angular/common';
import { Component, OnInit, viewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { InputComponent } from "../../../../shared/ui/input/input.component";
import { EVENT_FORM_FIELDS } from '../../constants/event-form.constant';
import { EventFormService } from '../../services/event-form.service';
import { RichEditorComponent } from "./components/rich-editor/rich-editor.component";
import { VenueLayoutEditorComponent } from "./components/venue-layout-editor/venue-layout-editor.component";
import { DrawingTool } from './models/define-venue.model';
import { Router, RouterLink } from "@angular/router";
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';


@Component({
  selector: 'app-define-venue',
  imports: [ButtonComponent, CommonModule, VenueLayoutEditorComponent, InputComponent, RichEditorComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './define-venue.component.html',
  styleUrl: './define-venue.component.scss'
})
export class DefineVenueComponent implements OnInit {

  private form!: FormGroup;
  protected sectionForm!: FormGroup;
  protected activeTool: DrawingTool = DrawingTool.NONE;

  protected readonly FORM_FIELD = EVENT_FORM_FIELDS
  protected readonly tools = [
    {
      name: DrawingTool.RECTANGLE,
      icon: 'icons/rectangle_tool.svg'
    },
    {
      name: DrawingTool.POLYGON,
      icon: 'icons/polygon_tool.svg'
    },
    {
      name: DrawingTool.CIRCLE,
      icon: 'icons/circle_tool.svg'
    }
  ]

  protected readonly APP_ROUTE = APP_ROUTES;

  private readonly editor = viewChild(VenueLayoutEditorComponent);


  constructor(private readonly eventFormService: EventFormService, private readonly fb: FormBuilder, private readonly router: Router) { }

  ngOnInit() {
    this.form = this.eventFormService.getForm();

    this.sectionForm = this.fb.group({
      [this.FORM_FIELD.VENUE_SECTION_NAME]: ['', Validators.required],
      [this.FORM_FIELD.VENUE_SECTION_CAPACITY]: [0, Validators.required],
      [this.FORM_FIELD.VENUE_SECTION_PRICE]: [0, Validators.required],
      [this.FORM_FIELD.VENUE_SECTION_DESCRIPTION]: ['', Validators.required],
      [this.FORM_FIELD.VENUE_SECTION_COLOR]: ['#FFFFFF', Validators.required],
      [this.FORM_FIELD.VENUE_SECTION_IMAGE]: [null, Validators.required],
    });

  }

  protected get venueSections(): FormArray {
    return this.form.get(this.FORM_FIELD.VENUE_SECTIONS) as FormArray;
  }

  protected selectTool(tool: DrawingTool) {
    this.activeTool = tool;
  }

  protected async saveSection() {

    if (this.editor()) {
      const file = await this.editor()?.captureSnapshot('image/png');
      this.sectionForm.get(this.FORM_FIELD.VENUE_SECTION_IMAGE)?.setValue(file);
    }

    if (this.sectionForm.invalid) return;


    const { value } = this.sectionForm;


    this.eventFormService.addVenueSection(
      value[this.FORM_FIELD.VENUE_SECTION_NAME],
      value[this.FORM_FIELD.VENUE_SECTION_CAPACITY],
      value[this.FORM_FIELD.VENUE_SECTION_PRICE],
      value[this.FORM_FIELD.VENUE_SECTION_DESCRIPTION],
      value[this.FORM_FIELD.VENUE_SECTION_COLOR],
      value[this.FORM_FIELD.VENUE_SECTION_IMAGE]
    );

    this.sectionForm.reset();

    this.editor()?.clearShapes();
  }

  saveAndContinue() {
    this.router.navigate([APP_ROUTES.CREATE_EVENT])
  }

}
