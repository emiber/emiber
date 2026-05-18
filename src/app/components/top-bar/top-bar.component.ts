import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IMenuOption } from 'src/app/services/models';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [MatIconModule, MenuComponent],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  selectedItem: IMenuOption = { link: 'home', icon: 'home', text: 'Home' };

  selectItem(item: IMenuOption) {
    this.selectedItem = item;
  }

}
