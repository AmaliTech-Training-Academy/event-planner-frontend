import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ButtonComponent } from "../../../../shared/ui/button/button.component";
import { Canvas, Circle, FabricImage, Rect } from 'fabric';

export enum DrawingTool {
  NONE = 'None',
  RECTANGLE = 'Rectangle',
  POLYGON = 'Polygon',
  CIRCLE = 'Circle',
}

@Component({
  selector: 'app-venue-layout-editor',
  imports: [ButtonComponent],
  templateUrl: './venue-layout-editor.component.html',
  styleUrls: ['./venue-layout-editor.component.scss']
})
export class VenueLayoutEditorComponent implements AfterViewInit {
  private canvas!: Canvas;
  @Input() public activeTool: DrawingTool = DrawingTool.CIRCLE;
  @ViewChild('canvasWrapper') canvasWrapper!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    const containerWidth = this.canvasWrapper.nativeElement.offsetWidth;
    const containerHeight = this.canvasWrapper.nativeElement.offsetHeight;

    this.canvas = new Canvas('venueCanvas', {
      width: containerWidth,
      height: containerHeight,
      isDrawingMode: false
    });

    this.registerDrawingEvents()
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        alert('Please upload a JPG or PNG image file.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageURL = e.target.result;
        this.loadBackgroundImage(imageURL);
      };
      reader.readAsDataURL(file);
    }
  }

  private loadBackgroundImage(url: string): void {
    if (!this.canvas) return;

    FabricImage.fromURL(url)
      .then((img) => {

        const scaleFactor = Math.min(
          this.canvas.width! / img.width!,
          this.canvas.height! / img.height!
        );

        img.set({
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          selectable: false,
          evented: false,
        });

        this.canvas.set({
          backgroundImage: img,
        });

        this.canvas.renderAll();

      })
      .catch(error => {
        console.error("Error loading image onto Fabric canvas:", error);
      });
  }

  private registerDrawingEvents(): void {
    let startX: number, startY: number;
    let shape: Rect | Circle | null = null;

    this.canvas.on('mouse:down', (opt) => {
      // If no drawing tool is selected, skip
      if (this.activeTool === DrawingTool.NONE) return;

      // If user clicked on an existing shape, skip creating a new one
      if (opt.target) return;

      const pointer = this.canvas.getPointer(opt.e);
      startX = pointer.x;
      startY = pointer.y;

      switch (this.activeTool) {
        case DrawingTool.RECTANGLE:
          shape = new Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: 'rgba(0, 0, 255, 0.3)',
            stroke: 'blue',
            strokeWidth: 2,
            selectable: true
          });
          this.canvas.add(shape);
          break;

        case DrawingTool.CIRCLE:
          shape = new Circle({
            left: startX,
            top: startY,
            radius: 0,
            fill: 'rgba(255, 0, 0, 0.3)',
            stroke: 'red',
            strokeWidth: 2,
            selectable: true
          });
          this.canvas.add(shape);
          break;
      }
    });

    this.canvas.on('mouse:move', (opt) => {
      if (!shape) return;

      const pointer = this.canvas.getPointer(opt.e);
      const width = pointer.x - startX;
      const height = pointer.y - startY;

      if (shape instanceof Rect) {
        shape.set({
          width: Math.abs(width),
          height: Math.abs(height),
          left: width < 0 ? pointer.x : startX,
          top: height < 0 ? pointer.y : startY
        });
      } else if (shape instanceof Circle) {
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        shape.set({
          radius,
          left: width < 0 ? pointer.x : startX,
          top: height < 0 ? pointer.y : startY
        });
      }

      this.canvas.renderAll();
    });

    this.canvas.on('mouse:up', () => {
      shape = null;
    });
  }


}
