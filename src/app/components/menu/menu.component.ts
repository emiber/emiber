import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  isOpen: boolean = false;

  menuItems: IMenuOption[];

  constructor() {
    this.menuItems = new Array<IMenuOption>();
    this.menuItems.push({ link: 'home', icon: 'home', text: 'Home' });
    this.menuItems.push({ link: 'projects', icon: 'lightbulb', text: 'Projects' });
    this.menuItems.push({ link: 'contact', icon: 'alternate_email', text: 'Contact' });
  }

  open(isOpen: boolean) {
    this.isOpen = isOpen;
  }
}

interface IMenuOption {
  link: string;
  icon: string;
  text: string;
}