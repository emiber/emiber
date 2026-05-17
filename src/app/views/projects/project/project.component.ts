import { Component, Input } from '@angular/core';
import { IProject } from 'src/app/services/models';

@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  @Input() project!: IProject;
}
