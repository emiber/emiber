import { Component } from '@angular/core';
import { IMenuOption } from 'src/app/services/models';

@Component({
  selector: 'app-top-bar',
  standalone: false,
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  selectedItem: IMenuOption = { link: 'home', icon: 'home', text: 'Home' };

  selectItem(item: IMenuOption) {
    this.selectedItem = item;
  }

}
