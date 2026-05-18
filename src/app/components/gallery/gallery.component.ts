import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})

export class GalleryComponent {
  @Input() images: string[] = [];
  @Input() imageSelected: number = 0;
  @Input() showModal: boolean = true;
  isModalOpen = false;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isModalOpen) {
      this.hideImage();
      return;
    }

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

  prevNext(index: number) {
    if (!this.images.length) {
      return;
    }

    this.imageSelected = (this.imageSelected + index + this.images.length) % this.images.length;
  }

  selectImage(index: number) {
    this.imageSelected = index;
  }

  showImage(): void {
    if (this.showModal && this.images.length) {
      this.isModalOpen = true;
    }
  }

  hideImage(): void {
    this.isModalOpen = false;
  }

  onImageClick(isModal: boolean): void {
    if (!isModal) {
      this.showImage();
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
    return isImageKey && this.images.length > 1;
  }
}
