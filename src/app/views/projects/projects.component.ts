import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProject } from 'src/app/services/models';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects!: IProject[];
  selected: number = 0;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.selected--;
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.selected++;
        break;
    }

    if (this.selected === this.projects.length) {
      this.selected = 0;
    } else if (this.selected < 0) {
      this.selected = this.projects.length - 1;
    }
  }

  constructor(private projectService: ProjectsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.projects = new Array<IProject>();
    const project = this.route.snapshot.params['project'];

    this.projectService.get().subscribe(res => {
      this.projects = res;
      for (let i = 0; i < this.projects.length; i++) {
        if (project === this.getFancyURL(this.projects[i].name)) {
          this.selected = i;
        }
      }
    });
  }

  select(index: number) {
    this.selected = index;
    this.router.navigate(['/projects', this.getFancyURL(this.projects[index].name)]);
  }

  private getFancyURL(text: string): string {
    return text.toLowerCase().replaceAll(' ', '_');
  }
}
