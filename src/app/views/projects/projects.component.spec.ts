import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { IProject } from 'src/app/services/models';
import { ProjectsService } from 'src/app/services/projects.service';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;
  const projects: IProject[] = [
    { name: 'Admin Panel', description: 'Admin Panel', images: [] },
    { name: 'Casalinda', description: 'Casalinda', images: [] },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
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
