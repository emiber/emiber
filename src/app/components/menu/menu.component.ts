import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  isOpen: boolean = false;

  open(isOpen: boolean) {
    this.isOpen = isOpen;
  }
}
