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
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  DragDropService,
  DropZoneRegistration as DropzoneRegistration,
} from '../services/drag-drop.service';

@Directive({
  selector: '[appDropzone]',
  standalone: true,
})
export class DropzoneDirective implements OnInit, OnDestroy {
  readonly dragDropService = inject(DragDropService);

  @Input() scopes: string[] = [];
  @Input() disabled = false;

  @Output() drop = new EventEmitter<CdkDragDrop<any>>();

  private dropzone!: DropzoneRegistration;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.setAttribute('droppable', 'true');
    this.dropzone = this.dragDropService.registerDropZone(
      this.scopes,
      this.elementRef.nativeElement.getBoundingClientRect()
    );
    this.dropzone.$onDrop.subscribe((event) => this.drop.emit(event.data));
  }

  ngOnDestroy(): void {
    this.dragDropService.unregisterDropZone(this.dropzone.id);
  }
}
