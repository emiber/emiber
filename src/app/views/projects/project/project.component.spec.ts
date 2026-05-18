import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IProject } from 'src/app/services/models';

import { ProjectComponent } from './project.component';

@Component({
  selector: 'app-gallery',
  standalone: false,
  template: ''
})
class GalleryStubComponent {
  @Input() images: string[] = [];
  @Input() imageSelected: number = 0;
}

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectComponent, GalleryStubComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    component.project = {
      name: 'Project',
      description: 'Project description',
      images: ['project.webp'],
    } satisfies IProject;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
