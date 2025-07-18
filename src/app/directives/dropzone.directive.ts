import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appDropzone]',
  standalone: true,
})
export class DropzoneDirective implements OnInit, OnDestroy {
  @Input() dragOverClass = 'drag-over';
  @Input() dragHintClass = 'drag-hint';
  @Input() acceptedTypes: string[] = [];
  @Input() disabled = false;
  @Input() cdkDropListData: any[] = []; // Für CDK-Kompatibilität

  @Output() dragEnter = new EventEmitter<any>();
  @Output() dragLeave = new EventEmitter<any>();
  @Output() drop = new EventEmitter<CdkDragDrop<any>>();

  private dragEnterCount = 0;
  private originalClasses: string[] = [];

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.originalClasses = Array.from(this.elementRef.nativeElement.classList);
    this.setupDropzone();
  }

  ngOnDestroy(): void {
    this.resetClasses();
  }

  private setupDropzone(): void {
    const element = this.elementRef.nativeElement;
    element.setAttribute('droppable', 'true');
  }

  // CDK-spezifische Event-Handler
  @HostListener('cdkDropListDropped', ['$event'])
  onCdkDrop(event: CdkDragDrop<any>): void {
    if (this.disabled) return;

    this.dragEnterCount = 0;
    this.removeDragClasses();
    this.drop.emit(event);
  }

  @HostListener('cdkDropListEntered', ['$event'])
  onCdkDragEnter(event: any): void {
    if (this.disabled) return;

    this.addDragClasses();
    this.dragEnter.emit(event);
  }

  @HostListener('cdkDropListExited', ['$event'])
  onCdkDragLeave(event: any): void {
    if (this.disabled) return;

    this.removeDragClasses();
    this.dragLeave.emit(event);
  }

  // Native HTML5 Drag & Drop Events (für Fallback)

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    if (this.isValidDragData(event)) {
      event.dataTransfer!.dropEffect = 'move';
    }
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragEnterCount++;

    if (this.dragEnterCount === 1 && this.isValidDragData(event)) {
      this.addDragClasses();
      this.dragEnter.emit(event);
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragEnterCount--;

    if (this.dragEnterCount === 0) {
      this.removeDragClasses();
      this.dragLeave.emit(event);
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    if (this.disabled) return;

    event.preventDefault();
    event.stopPropagation();

    this.dragEnterCount = 0;
    this.removeDragClasses();

    if (this.isValidDragData(event)) {
      // Create a CdkDragDrop-like event object
      const dropEvent = {
        previousContainer: null,
        container: null,
        previousIndex: -1,
        currentIndex: -1,
        item: {
          data: this.extractDragData(event),
        },
        isPointerOverContainer: true,
        distance: { x: 0, y: 0 },
        dropPoint: { x: event.clientX, y: event.clientY },
        event: event,
      } as any;

      this.drop.emit(dropEvent);
    }
  }

  private isValidDragData(event: DragEvent): boolean {
    if (!event.dataTransfer) return false;

    if (this.acceptedTypes.length === 0) return true;

    const types = Array.from(event.dataTransfer.types);
    return this.acceptedTypes.some((acceptedType) =>
      types.includes(acceptedType)
    );
  }

  private extractDragData(event: DragEvent): any {
    if (!event.dataTransfer) return null;

    // Try to get JSON data first
    try {
      const jsonData = event.dataTransfer.getData('application/json');
      if (jsonData) {
        return JSON.parse(jsonData);
      }
    } catch (e) {
      // Fall back to text data
    }

    // Try text data
    const textData = event.dataTransfer.getData('text/plain');
    if (textData) {
      return textData;
    }

    return null;
  }

  private addDragClasses(): void {
    const element = this.elementRef.nativeElement;

    if (this.dragOverClass) {
      element.classList.add(this.dragOverClass);
    }

    if (this.dragHintClass) {
      element.classList.add(this.dragHintClass);
    }
  }

  private removeDragClasses(): void {
    const element = this.elementRef.nativeElement;

    if (this.dragOverClass) {
      element.classList.remove(this.dragOverClass);
    }

    if (this.dragHintClass) {
      element.classList.remove(this.dragHintClass);
    }
  }

  private resetClasses(): void {
    const element = this.elementRef.nativeElement;
    element.className = this.originalClasses.join(' ');
  }
}
