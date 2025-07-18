import {
  Directive,
  HostListener,
  inject,
  input,
  ElementRef,
} from '@angular/core';
import { DragDropService } from '../services/drag-drop.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Directive({
  selector: '[appDragHandler]',
})
export class DragHandlerDirective {
  readonly dragDropService = inject(DragDropService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  scope = input<string>(undefined, { alias: 'appDragScope' });

  @HostListener('cdkDragEnded', ['$event'])
  onDragEnd(event: CdkDragEnd): void {
    const wasDroppedInValidZone = this.dragDropService.emitDrop(
      this.scope(),
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
