import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IMenuOption } from 'src/app/services/models';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
    { link: 'chat', icon: 'smart_toy', text: 'Chat' },
  ];

  constructor(private router: Router, private elementRef: ElementRef<HTMLElement>) {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.selectByUrl(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit(): void {
    this.selectByUrl(this.router.url);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.close();
  }

  toggle(event: MouseEvent) {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  close(): void {
    this.isOpen = false;
  }

  select(item: IMenuOption) {
    this.itemSelected.emit(item);
    this.close();
  }

  private selectByUrl(url: string): void {
    const segmentSelected = url.split('?')[0].split('/')[1] || 'home';
    const item = this.menuItems.find(el => el.link === segmentSelected);
    if (item) {
      this.select(item);
    }
  }
}
