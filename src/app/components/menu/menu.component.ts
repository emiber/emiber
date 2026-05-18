import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IMenuOption } from 'src/app/services/models';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  @Output() itemSelected = new EventEmitter<IMenuOption>();
  isOpen: boolean = false;

  menuItems: IMenuOption[] = [
    { link: 'home', icon: 'home', text: 'Home' },
    { link: 'projects', icon: 'lightbulb', text: 'Projects' },
    // { link: 'labs', icon: 'science', text: 'Labs' },
    { link: 'contact', icon: 'alternate_email', text: 'Contact' },
  ];

  constructor(private router: Router) {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectByUrl(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    this.selectByUrl(this.router.url);
  }

  open(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  select(item: IMenuOption) {
    this.itemSelected.emit(item);
  }

  private selectByUrl(url: string): void {
    const segmentSelected = url.split('?')[0].split('/')[1] || 'home';
    const item = this.menuItems.find(el => el.link === segmentSelected);
    if (item) {
      this.select(item);
    }
  }
}
