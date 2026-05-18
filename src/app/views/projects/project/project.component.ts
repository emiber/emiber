import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IProject } from 'src/app/services/models';
import { GalleryComponent } from 'src/app/components/gallery/gallery.component';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, GalleryComponent],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() project!: IProject;
}
