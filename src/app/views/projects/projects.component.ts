import { Component, DestroyRef, HostListener, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IProject } from 'src/app/services/models';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  projects: IProject[] = [];
  selected: number = 0;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.projects.length) {
      return;
    }

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.selectByOffset(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.selectByOffset(1);
        break;
    }
  }

  constructor(private projectService: ProjectsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    combineLatest([this.projectService.get(), this.route.paramMap])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([projects, paramMap]) => {
        this.projects = projects;
        this.selectFromSlug(paramMap.get('project'));
      });
  }

  select(index: number) {
    if (!this.projects[index]) {
      return;
    }

    this.selected = index;
    this.router.navigate(['/projects', this.getFancyURL(this.projects[index].name)]);
  }

  private selectByOffset(offset: number): void {
    const nextIndex = (this.selected + offset + this.projects.length) % this.projects.length;
    this.select(nextIndex);
  }

  private selectFromSlug(slug: string | null): void {
    if (!this.projects.length) {
      this.selected = 0;
      return;
    }

    const selectedIndex = slug
      ? this.projects.findIndex(project => slug === this.getFancyURL(project.name))
      : 0;

    this.selected = selectedIndex >= 0 ? selectedIndex : 0;

    if (!slug || selectedIndex < 0) {
      this.router.navigate(
        ['/projects', this.getFancyURL(this.projects[this.selected].name)],
        { replaceUrl: true }
      );
    }
  }

  private getFancyURL(text: string): string {
    return text.toLowerCase().replaceAll(' ', '_');
  }
}
