import { Component } from '@angular/core';
import { games } from '../environments/games';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public games = games;
  constructor() {}
}
