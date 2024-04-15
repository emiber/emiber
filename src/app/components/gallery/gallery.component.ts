import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})

export class GalleryComponent {
  @Input() images!: string[];
  @Input() imageSelected: number = 0;

  constructor(public dialog: MatDialog) {
    // console.log('hola');
    // this.project = this.data.project;
    // this.imageSelected = this.data.imageSelected;
  }

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
    // console.log(this.data);
    const dialogRef = this.dialog.open(GalleryComponent);
    // this.showModal = !this.showModal;
  }


}
