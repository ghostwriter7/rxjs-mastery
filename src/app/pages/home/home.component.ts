import { Component, OnInit } from '@angular/core';
import { games } from '../../../environments/games';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public games = games;

  constructor() { }

  ngOnInit(): void {
  }

}
