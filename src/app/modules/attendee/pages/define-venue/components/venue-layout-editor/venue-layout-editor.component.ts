import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { Canvas, Circle, FabricImage, Polygon, Rect } from 'fabric';
import { ButtonComponent } from "../../../../../../shared/ui/button/button.component";
import { DrawingTool } from '../../models/define-venue.model';

@Component({
  selector: 'app-venue-layout-editor',
  imports: [ButtonComponent],
  templateUrl: './venue-layout-editor.component.html',
  styleUrls: ['./venue-layout-editor.component.scss']
})
export class VenueLayoutEditorComponent implements AfterViewInit {
  private canvas!: Canvas;
  public readonly activeTool = input<DrawingTool>(DrawingTool.NONE);
  public readonly shapeColor = input<string>('#1976d2');
  public readonly fillOpacity = input<number>(0.3);
  public snapshot = output<File>();
  private canvasWrapper = viewChild<ElementRef<HTMLDivElement>>('canvasWrapper');

  // Minimum acceptable sizes
  private readonly MIN_RECT_SIZE = 16; 
  private readonly MIN_CIRCLE_RADIUS = 10; 
  private readonly MIN_POLYGON_AREA = 50; 

  // Polygon drawing state
  private isDrawingPolygon = false;
  private polygonPoints: { x: number; y: number }[] = [];
  private currentPolygon: Polygon | null = null;

  // Shapes registry
  private shapeIdCounter = 1;
  public shapes: { id: number; type: DrawingTool; object: Rect | Circle | Polygon; visible: boolean }[] = [];


  ngAfterViewInit(): void {
    const containerWidth = this.canvasWrapper()?.nativeElement.offsetWidth;
    const containerHeight = this.canvasWrapper()?.nativeElement.offsetHeight;

    this.canvas = new Canvas('venueCanvas', {
      width: containerWidth,
      height: containerHeight,
      isDrawingMode: false
    });

    this.registerDrawingEvents()
    this.registerSelectionLogging()
    this.registerKeyboardDeletion()
  }



  private addShapeToRegistry(object: Rect | Circle | Polygon, type: DrawingTool) {
    const id = this.shapeIdCounter++;
    this.shapes.push({ id, type, object, visible: true });
    return id;
  }

  public selectShape(id: number): void {
    const entry = this.shapes.find(s => s.id === id);
    if (!entry) return;
    this.canvas.setActiveObject(entry.object as any);
    this.canvas.requestRenderAll();
  }

  public deleteShape(id: number): void {
    const index = this.shapes.findIndex(s => s.id === id);
    if (index === -1) return;
    const entry = this.shapes[index];
    this.canvas.remove(entry.object);
    this.shapes.splice(index, 1);
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  public toggleShapeVisibility(id: number, visible: boolean): void {
    const entry = this.shapes.find(s => s.id === id);
    if (!entry) return;
    entry.object.set({ visible });
    entry.visible = visible;
    this.canvas.requestRenderAll();
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
    let shape: Rect | Circle | Polygon | null = null;

    this.canvas.on('mouse:down', (opt) => {

      console.log(this.shapes)
      if (this.activeTool() === DrawingTool.NONE) return;

      // Do not start polygon drawing if a shape is currently selected
      if (this.activeTool() === DrawingTool.POLYGON && this.canvas.getActiveObject()) return;

      if (opt.target) return;

      const pointer = this.canvas.getPointer(opt.e);
      startX = pointer.x;
      startY = pointer.y;

      switch (this.activeTool()) {
        case DrawingTool.RECTANGLE:
          // Create but DO NOT add until it meets min size
          shape = new Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: this.getFillColor(this.shapeColor(), this.fillOpacity()),
            stroke: this.shapeColor(),
            strokeWidth: 2,
            selectable: true
          });
          break;

        case DrawingTool.POLYGON:
          if (!this.isDrawingPolygon) {
            this.isDrawingPolygon = true;
            this.polygonPoints = [
              { x: startX, y: startY },
              { x: startX, y: startY },
            ];
            this.currentPolygon = new Polygon(this.polygonPoints, {
              fill: this.getFillColor(this.shapeColor(), this.fillOpacity()),
              stroke: this.shapeColor(),
              strokeWidth: 2,
              selectable: false,
              evented: false,
              objectCaching: false,
            });
            this.canvas.add(this.currentPolygon);
          } else {
            // Insert a fixed point before the dynamic preview point
            this.polygonPoints.splice(this.polygonPoints.length - 1, 0, {
              x: startX,
              y: startY,
            });
            if (this.currentPolygon) {
              this.currentPolygon.set({ points: this.polygonPoints });
            }
            this.canvas.requestRenderAll();
          }
          break;

        case DrawingTool.CIRCLE:
          // Create but DO NOT add until it meets min radius
          shape = new Circle({
            left: startX,
            top: startY,
            radius: 0,
            fill: this.getFillColor(this.shapeColor(), this.fillOpacity()),
            stroke: this.shapeColor(),
            strokeWidth: 2,
            selectable: true
          });
          break;
      }

    });

    this.canvas.on('mouse:move', (opt) => {
      // Update interactive polygon preview point
      if (this.isDrawingPolygon && this.currentPolygon) {
        const pointer = this.canvas.getPointer(opt.e);
        // Update the last point (preview) to follow the mouse
        const lastIndex = this.polygonPoints.length - 1;
        if (lastIndex >= 0) {
          this.polygonPoints[lastIndex] = { x: pointer.x, y: pointer.y };
          this.currentPolygon.set({ points: this.polygonPoints });
          this.canvas.requestRenderAll();
        }
        return;
      }

      if (!shape) return;

      const pointer = this.canvas.getPointer(opt.e);
      const width = pointer.x - startX;
      const height = pointer.y - startY;

      if (shape instanceof Rect) {
        const absW = Math.abs(width);
        const absH = Math.abs(height);

        // Only add to canvas when above minimum size
        if (!shape.canvas && (absW >= this.MIN_RECT_SIZE && absH >= this.MIN_RECT_SIZE)) {
          this.canvas.add(shape);
        }

        if (shape.canvas) {
          shape.set({
            width: absW,
            height: absH,
            left: width < 0 ? startX - absW : startX,
            top: height < 0 ? startY - absH : startY
          });
        }
      } else if (shape instanceof Circle) {
        const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

        if (!shape.canvas && radius >= this.MIN_CIRCLE_RADIUS) {
          this.canvas.add(shape);
        }

        if (shape.canvas) {
          shape.set({
            radius,
            left: width < 0 ? pointer.x : startX,
            top: height < 0 ? pointer.y : startY
          });
        }
      }

      this.canvas.renderAll();
    });

    this.canvas.on('mouse:up', () => {
      // Register finalized Rect/Circle shapes
      if (shape instanceof Rect) {
        const isOnCanvas = Boolean(shape.canvas);
        const isValid = (shape.width || 0) >= this.MIN_RECT_SIZE && (shape.height || 0) >= this.MIN_RECT_SIZE;
        if (isOnCanvas && isValid) {
          this.addShapeToRegistry(shape, DrawingTool.RECTANGLE);
        } else if (isOnCanvas && !isValid) {
          this.canvas.remove(shape);
        }
      } else if (shape instanceof Circle) {
        const isOnCanvas = Boolean(shape.canvas);
        const isValid = (shape.radius || 0) >= this.MIN_CIRCLE_RADIUS;
        if (isOnCanvas && isValid) {
          this.addShapeToRegistry(shape, DrawingTool.CIRCLE);
        } else if (isOnCanvas && !isValid) {
          this.canvas.remove(shape);
        }
      }
      shape = null;
    });

    // Keyboard shortcuts: Enter/Escape to finish/cancel polygon
    // Attach to window to capture while canvas is focused
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.isDrawingPolygon) return;
      if (e.key === 'Enter') {
        // Finalize if enough points
        if (this.currentPolygon && this.polygonPoints.length >= 4) {
          this.polygonPoints.pop();

          // Compute polygon area (shoelace) to ensure it's at least a triangle, not a line
          const area = Math.abs(this.computePolygonArea(this.polygonPoints));
          if (area < this.MIN_POLYGON_AREA) {
            alert('Polygon area is too small. Please create at least a triangle.');
            // Restore preview point at the end for continued drawing
            const last = this.polygonPoints[this.polygonPoints.length - 1];
            this.polygonPoints.push({ x: last.x, y: last.y });
            if (this.currentPolygon) this.currentPolygon.set({ points: this.polygonPoints });
            this.canvas.requestRenderAll();
            return;
          }

          this.currentPolygon.set({
            points: this.polygonPoints,
            selectable: true,
            evented: true,
          });
          this.canvas.requestRenderAll();
          this.addShapeToRegistry(this.currentPolygon, DrawingTool.POLYGON);
        }
        this.isDrawingPolygon = false;
        this.polygonPoints = [];
        this.currentPolygon = null;
      }
      if (e.key === 'Escape') {
        // Cancel current polygon
        if (this.currentPolygon) {
          this.canvas.remove(this.currentPolygon);
          this.canvas.requestRenderAll();
        }
        this.isDrawingPolygon = false;
        this.polygonPoints = [];
        this.currentPolygon = null;
      }

    });
  }

  private getFillColor(color: string, opacity: number): string {
    // Supports hex (#RRGGBB or #RGB) and rgb/rgba strings
    if (color.startsWith('#')) {
      const { r, g, b } = this.hexToRgb(color);
      return `rgba(${r}, ${g}, ${b}, ${this.clampOpacity(opacity)})`;
    }
    if (color.startsWith('rgb')) {
      // Normalize to rgba with provided opacity
      const nums = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .split(',')
        .map(v => parseFloat(v.trim())) as number[];
      const r = nums[0] || 0;
      const g = nums[1] || 0;
      const b = nums[2] || 0;
      return `rgba(${r}, ${g}, ${b}, ${this.clampOpacity(opacity)})`;
    }
    // Fallback
    return `rgba(25, 118, 210, ${this.clampOpacity(opacity)})`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    let normalized = hex.replace('#', '');
    if (normalized.length === 3) {
      normalized = normalized.split('').map(c => c + c).join('');
    }
    const num = parseInt(normalized, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }

  private clampOpacity(value: number): number {
    if (Number.isNaN(value)) return 0.3;
    return Math.max(0, Math.min(1, value));
  }

  public async captureSnapshot(mimeType: 'image/png' | 'image/jpeg' = 'image/png', quality?: number): Promise<File> {
    if (!this.canvas) throw new Error('Canvas is not initialized yet');
    const format = mimeType === 'image/jpeg' ? 'jpeg' : 'png';
    const dataUrl = this.canvas.toDataURL({ format, quality, multiplier: 1 });
    const blob = await (await fetch(dataUrl)).blob();
    const fileName = `venue-layout.${format}`;
    return new File([blob], fileName, { type: mimeType });
  }

  public async emitSnapshot(mimeType: 'image/png' | 'image/jpeg' = 'image/png', quality?: number): Promise<void> {
    const file = await this.captureSnapshot(mimeType, quality);
    this.snapshot.emit(file);
  }

  private computePolygonArea(points: { x: number; y: number }[]): number {
    let sum = 0;
    const n = points.length;
    if (n < 3) return 0;
    for (let i = 0; i < n; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      sum += p1.x * p2.y - p2.x * p1.y;
    }
    return sum / 2;
  }

  private registerSelectionLogging(): void {
    const logType = (target: any) => {
      if (!target) return;
      let typeLabel = 'Unknown';
      if (target.type === 'rect') typeLabel = 'Rectangle';
      if (target.type === 'circle') typeLabel = 'Circle';
      if (target.type === 'polygon') typeLabel = 'Polygon';

      const entry = this.shapes.find(s => s.object === target);
      const idInfo = entry ? ` (id: ${entry.id})` : '';
      console.log(`Selected shape: ${typeLabel}${idInfo}`);
    };

    this.canvas.on('selection:created', (e: any) => logType(e.selected?.[0]));
    this.canvas.on('selection:updated', (e: any) => logType(e.selected?.[0]));
    this.canvas.on('selection:cleared', () => console.log('Selection cleared'));
  }

  private registerKeyboardDeletion(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const active = this.canvas.getActiveObject() as any;
      if (!active) return;

      const entry = this.shapes.find(s => s.object === active);
      if (!entry) return;

      e.preventDefault();
      this.deleteShape(entry.id);
    });
  }

  public clearShapes(): void {
    if (!this.canvas) return;
    const allObjects = this.canvas.getObjects();
    allObjects.forEach(obj => this.canvas.remove(obj));
    this.canvas.discardActiveObject();
    this.shapes = [];
    this.shapeIdCounter = 1;
    this.canvas.requestRenderAll();
  }

}
