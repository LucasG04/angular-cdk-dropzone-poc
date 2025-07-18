import {
  Directive,
  HostListener,
  inject,
  input,
  ElementRef,
} from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appDragRegister]',
})
export class DragRegisterDirective {
  readonly dragDropService = inject(DragDropService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  dragScope = input<string>();

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnd(event: CdkDragEnd): void {
    const wasDroppedInValidZone = this.dragDropService.emitDrop(
      this.dragScope(),
      event
    );

    if (wasDroppedInValidZone) {
      event.source.reset();
    } else {
      this.snapBack(event);
    }
  }

  private snapBack(event: CdkDragEnd): void {
    const SNAP_BACK_DURATION = 200;

    const element = this.elementRef.nativeElement;
    element.style.transition = `transform ${SNAP_BACK_DURATION}ms ease-out`;
    element.style.transform = 'translate(0px, 0px)';

    setTimeout(() => {
      element.style.transition = '';
      element.style.transform = '';
      event.source.reset();
    }, SNAP_BACK_DURATION);
  }
}
