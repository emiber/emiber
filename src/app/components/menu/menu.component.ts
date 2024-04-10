import { Component, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IMenuOption } from 'src/app/services/models';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Output() itemSelected: BehaviorSubject<IMenuOption> = new BehaviorSubject<IMenuOption>({} as IMenuOption);
  isOpen: boolean = false;
  timedOutCloser: any;

  menuItems: IMenuOption[];

  constructor(private router: Router) {
    let segmentSelected: string;
    this.menuItems = new Array<IMenuOption>();
    this.menuItems.push({ link: 'home', icon: 'home', text: 'Home' });
    this.menuItems.push({ link: 'projects', icon: 'lightbulb', text: 'Projects' });
    // this.menuItems.push({ link: 'labs', icon: 'science', text: 'Labs' });
    this.menuItems.push({ link: 'contact', icon: 'alternate_email', text: 'Contact' });

    this.select(this.menuItems[0]);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event!.url!.split('/') && event!.url!.split('/')[1]) {
        segmentSelected = event.url.split('/')[1];

        const item = this.menuItems.find(el => el.link === segmentSelected);
        if (item) {
          this.select(item);
        }
      }
    });
  }

  open(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  select(item: IMenuOption) {
    this.itemSelected.next(item);
  }
}