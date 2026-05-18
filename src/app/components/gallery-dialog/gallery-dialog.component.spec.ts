import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GalleryDialogComponent } from './gallery-dialog.component';

@Component({
  selector: 'app-gallery',
  standalone: false,
  template: ''
})
class GalleryStubComponent {
  @Input() images: string[] = [];
  @Input() imageSelected: number = 0;
  @Input() showModal: boolean = true;
}

describe('GalleryDialogComponent', () => {
  let component: GalleryDialogComponent;
  let fixture: ComponentFixture<GalleryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GalleryDialogComponent, GalleryStubComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { images: ['image.webp'], imageSelected: 0 } }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GalleryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
