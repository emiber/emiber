import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, DragDropModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})

export class GalleryComponent {
  @Input() images: string[] = [];
  @Input() imageSelected: number = 0;
  @Input() showModal: boolean = true;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.canHandleKeyboard(event.key)) {
      return;
    }

    event.preventDefault();
    switch (event.key) {
      case 'ArrowRight':
        this.prevNext(1);
        break;
      case 'ArrowLeft':
        this.prevNext(-1);
        break;
    }
  }

  constructor(public dialog: MatDialog) { }

  prevNext(index: number) {
    if (!this.images.length) {
      return;
    }

    this.imageSelected = (this.imageSelected + index + this.images.length) % this.images.length;
  }

  selectImage(index: number) {
    this.imageSelected = index;
  }

  async showImage(): Promise<void> {
    if (this.showModal && this.images.length) {
      const { GalleryDialogComponent } = await import('../gallery-dialog/gallery-dialog.component');
      this.dialog.open(GalleryDialogComponent, { data: { images: this.images, imageSelected: this.imageSelected } });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.distance.x === 0) {
      return;
    }

    this.prevNext(event.distance.x > 0 ? -1 : 1);
  }

  private canHandleKeyboard(key: string): boolean {
    const isImageKey = key === 'ArrowRight' || key === 'ArrowLeft';
    const parentDialogIsOpen = this.showModal && this.dialog.openDialogs.length > 0;
    return isImageKey && this.images.length > 1 && !parentDialogIsOpen;
  }
}
