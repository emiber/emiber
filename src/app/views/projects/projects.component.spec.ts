import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { IProject } from 'src/app/services/models';
import { ProjectsService } from 'src/app/services/projects.service';

import { ProjectsComponent } from './projects.component';

@Component({
  selector: 'app-project',
  standalone: false,
  template: ''
})
class ProjectStubComponent {
  @Input() project!: IProject;
}

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  const projects: IProject[] = [
    { name: 'Admin Panel', description: 'Admin Panel', images: ['panel.webp'] },
    { name: 'Casalinda', description: 'Casalinda', images: ['casalinda.webp'] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectsComponent, ProjectStubComponent],
      imports: [CommonModule, RouterTestingModule],
      providers: [
        { provide: ProjectsService, useValue: { get: () => of(projects) } },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ project: 'casalinda' })) } },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
