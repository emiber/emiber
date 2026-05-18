import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GalleryDialogComponent } from './gallery-dialog.component';

describe('GalleryDialogComponent', () => {
  let component: GalleryDialogComponent;
  let fixture: ComponentFixture<GalleryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryDialogComponent, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { images: [], imageSelected: 0 } }
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
