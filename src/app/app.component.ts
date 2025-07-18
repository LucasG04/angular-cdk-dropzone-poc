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
import { DragRegisterDirective } from './directives/drag-register.directive';

@Component({
  selector: 'app-root',
  imports: [DragDropModule, DropzoneDirective, DragRegisterDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  onDrop(event: CdkDragDrop<string[]>, zone: string): void {
    console.log('Dropped in zone:', zone, event);
  }
}
