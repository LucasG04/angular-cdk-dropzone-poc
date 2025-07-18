import { Directive, HostListener, inject, input } from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appDragRegister]',
})
export class DragRegisterDirective {
  readonly dragDropService = inject(DragDropService);

  dragScope = input<string>();

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnd(event: CdkDragEnd): void {
    this.dragDropService.emitDrop(this.dragScope(), event);
  }
}
