import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { IMenuOption } from 'src/app/services/models';

import { TopBarComponent } from './top-bar.component';

@Component({
  selector: 'app-menu',
  standalone: false,
  template: ''
})
class MenuStubComponent {
  @Output() itemSelected = new EventEmitter<IMenuOption>();
}

describe('TopBarComponent', () => {
  let component: TopBarComponent;
  let fixture: ComponentFixture<TopBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopBarComponent, MenuStubComponent],
      imports: [MatIconModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
