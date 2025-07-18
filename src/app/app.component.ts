import {
  DragDropModule,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropzoneDirective } from './directives/dropzone.directive';

@Component({
  selector: 'app-root',
  imports: [DragDropModule, DropzoneDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  // Data properties
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  zone1Items: string[] = [];
  zone2Items: string[] = [];

  // Visual state properties
  isDragging = false;
  private currentMousePosition = { x: 0, y: 0 };

  isMoverZone = (drag: CdkDrag, drop: CdkDropList) => {
    const rect = drop.element.nativeElement.getBoundingClientRect();
    console.log('Checking mover zone:', rect, this.currentMousePosition);
    return (
      this.currentMousePosition.x >= rect.left &&
      this.currentMousePosition.x <= rect.right &&
      this.currentMousePosition.y >= rect.top &&
      this.currentMousePosition.y <= rect.bottom
    );
  };

  // Drag event handlers
  onDragStart(event: any, item: string): void {
    console.log('Drag started:', item, event);
    this.isDragging = true;

    // Mouse tracking für präzise Hover-Detection starten
    document.addEventListener('mousemove', this.trackMousePosition);

    // Add visual feedback for drag start
    if (event.target) {
      event.target.classList.add('dragging');
    }
  }

  onDragEnd(event: any, item: string): void {
    console.log('Drag ended:', item, event);
    this.isDragging = false;

    // Mouse tracking stoppen
    document.removeEventListener('mousemove', this.trackMousePosition);

    // Remove visual feedback
    if (event.target) {
      event.target.classList.remove('dragging');
    }
  }

  private trackMousePosition = (event: MouseEvent) => {
    this.currentMousePosition = { x: event.clientX, y: event.clientY };
  };

  onDragEnter(event: any, zone?: string): void {
    console.log('Drag entered', zone, event);
  }

  onDragLeave(event: any, zone?: string): void {
    console.log('Drag left', zone, event);
  }

  onDrop(event: CdkDragDrop<string[]>, zone: string): void {
    console.log('Dropped in zone:', zone, event);

    // Remove visual feedback
    this.isDragging = false;

    // Add success animation
    this.addDropSuccessAnimation(zone);
  }

  private addDropSuccessAnimation(zone: string): void {
    // Add a brief success animation to the dropzone
    const element = document.querySelector(`.dropzone.${zone}`);
    if (element) {
      element.classList.add('drop-success');
      setTimeout(() => {
        element.classList.remove('drop-success');
      }, 300);
    }
  }
}
