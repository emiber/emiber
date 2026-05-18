import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GalleryComponent } from '../gallery/gallery.component';

@Component({
  selector: 'app-gallery-dialog',
  standalone: true,
  imports: [GalleryComponent],
  templateUrl: './gallery-dialog.component.html',
  styleUrl: './gallery-dialog.component.scss'
})
export class GalleryDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { images: string[], imageSelected: number }) { }

}
