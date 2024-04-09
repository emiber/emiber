import { Component } from '@angular/core';
import { IMenuOption } from 'src/app/services/models';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  selectedItem!: IMenuOption;

  selectItem(item: IMenuOption) {
    this.selectedItem = item;
  }

}
