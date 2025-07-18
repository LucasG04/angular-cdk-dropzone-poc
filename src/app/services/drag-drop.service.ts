import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface DropZoneRegistration {
  id: string;
  scopes: string[];
  rect: DOMRect;
  $onDrop: Subject<{ data: any }>;
}

@Injectable({
  providedIn: 'root',
})
export class DragDropService {
  private readonly registeredDropZones: Map<string, DropZoneRegistration> =
    new Map();

  registerDropZone(scopes: string[], rect: DOMRect): DropZoneRegistration {
    const zoneId = crypto.randomUUID();
    const dropZone: DropZoneRegistration = {
      id: zoneId,
      scopes,
      rect,
      $onDrop: new Subject<{ data: any }>(),
    };
    this.registeredDropZones.set(zoneId, dropZone);
    return dropZone;
  }

  unregisterDropZone(dropZoneId: string) {
    this.registeredDropZones.delete(dropZoneId);
  }

  emitDrop(scope: string | undefined, event: CdkDragEnd): void {
    for (const zone of this.registeredDropZones.values()) {
      const isMatchingScope =
        !scope || zone.scopes.length === 0 || zone.scopes.includes(scope);
      if (isMatchingScope) {
        const isInZone =
          event.dropPoint.x >= zone.rect.left &&
          event.dropPoint.x <= zone.rect.right &&
          event.dropPoint.y >= zone.rect.top &&
          event.dropPoint.y <= zone.rect.bottom;
        if (isInZone) {
          zone.$onDrop?.next({ data: event.source?.data });
        }
      }
    }
  }
}
