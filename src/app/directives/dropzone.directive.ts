import {
  Directive,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  inject,
} from '@angular/core';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import {
  DragDropService,
  DropZoneRegistration,
} from '../services/drag-drop.service';

@Directive({
  selector: '[appDropzone]',
  standalone: true,
})
export class DropzoneDirective implements OnInit, OnDestroy {
  readonly dragDropService = inject(DragDropService);

  @Input() dragOverClass = 'drag-over';
  @Input() dragHintClass = 'drag-hint';
  @Input() scopes: string[] = [];
  @Input() disabled = false;

  // @Output() dragEnter = new EventEmitter<any>();
  // @Output() dragLeave = new EventEmitter<any>();
  @Output() drop = new EventEmitter<CdkDragDrop<any>>();

  private dropZone!: DropZoneRegistration;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.setAttribute('droppable', 'true');
    this.dropZone = this.dragDropService.registerDropZone(
      this.scopes,
      this.elementRef.nativeElement.getBoundingClientRect()
    );
    this.dropZone.$onDrop.subscribe((event) => this.drop.emit(event.data));
  }

  ngOnDestroy(): void {
    this.dragDropService.unregisterDropZone(this.dropZone.id);
  }
}
