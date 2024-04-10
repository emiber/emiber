import { Component, HostListener, Input } from '@angular/core';
import { IProject } from 'src/app/services/models';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() project!: IProject;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.prevNext(1);
  }

  imageSelected: number = 0

  prevNext(index: number) {
    this.imageSelected = this.imageSelected + index;

    if (this.imageSelected === this.project.images.length) {
      this.imageSelected = 0;
    } else if (this.imageSelected < 0) {
      this.imageSelected = this.project.images.length - 1;
    }
  }

  selectImage(index: number) {
    this.imageSelected = index;
  }
}
