import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GalleryDialogComponent } from '../gallery-dialog/gallery-dialog.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})

export class GalleryComponent {
  @Input() images!: string[];
  @Input() imageSelected: number = 0;
  @Input() showModal: boolean = true;

  constructor(public dialog: MatDialog) { }

  prevNext(index: number) {
    this.imageSelected = this.imageSelected + index;

    if (this.imageSelected === this.images.length) {
      this.imageSelected = 0;
    } else if (this.imageSelected < 0) {
      this.imageSelected = this.images.length - 1;
    }
  }

  selectImage(index: number) {
    this.imageSelected = index;
  }

  showImage() {
    if (this.showModal) {
      const dialogRef = this.dialog.open(GalleryDialogComponent, { data: { images: this.images, imageSelected: this.imageSelected } });
    }
  }
}
