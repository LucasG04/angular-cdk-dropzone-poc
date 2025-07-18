# Angular CDK Dropzone POC

A Proof of Concept implementation for custom dropzone functionality using Angular CDK Drag and Drop. This project demonstrates how to create dropzones that work independently of Angular CDK's standard drop lists.

## Purpose

This POC addresses limitations in Angular CDK's standard drag-drop implementation by providing:

- **Custom dropzones** that aren't tied to CDK drop lists
- **Scope-based dropping** for targeted drag operations
- **Service-based architecture** for managing multiple dropzones

## Project Structure

```
src/app/
├── directives/
│   ├── dropzone.directive.ts          # Dropzone directive
│   ├── drag-register.directive.ts     # Drag registration directive
├── services/
│   ├── drag-drop.service.ts           # Dropzone management service
└── app.component.*                    # Demo implementation
```

## Usage

1. **Add the dropzone directive** to any element:

```html
<div appDropzone (drop)="onDrop($event)">Drop items here</div>
```

2. **Register draggable items** with the drag directive:

```html
<div cdkDrag appDragRegister [cdkDragData]="myData">Draggable Item</div>
```

## Currently missing

- Enter and leave events for the dropzone
- Hint and over css classes for the dropzone
