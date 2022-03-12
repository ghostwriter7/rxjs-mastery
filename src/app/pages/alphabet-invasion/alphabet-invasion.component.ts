import { Component, OnInit, ViewChild } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  fromEvent,
  interval,
  map,
  scan,
  startWith, Subject,
  switchMap,
  takeWhile,
  tap
} from 'rxjs';

interface Letter {
  letter: string,
  xPos: number
}

interface Letters {
  interval: number;
  letters: Letter[]
}

interface State {
  level: number,
  letters: Letter[],
  score: number
}

@Component({
  selector: 'app-alphabet-invasion',
  templateUrl: './alphabet-invasion.component.html',
  styleUrls: ['./alphabet-invasion.component.scss']
})
export class AlphabetInvasionComponent implements OnInit {
  @ViewChild('#game') gameEl!: HTMLElement;

  public score = 0;
  public level = 0;
  public endThreshold = 15;
  public speedAdjust = 50;
  public levelThreshold = 20;
  public gameWidth = 30;
  public isGameOver = false;

  public html$ = new Subject<string>();

  private letterInterval = new BehaviorSubject<number>(600);

  private letters$ = this.letterInterval.pipe(
    tap(console.log),
    switchMap(i => interval(i).pipe(
      scan<number, Letters>((letters) => {
        return {
          interval: i,
          letters: [
            {
              letter: this.getRandomLetter(),
              xPos: Math.floor(Math.random() * this.gameWidth)
            },
            ...letters.letters
          ]
        }
      }, {interval: 0, letters: []}))
    ));

  private keys$ = fromEvent(document, 'keydown').pipe(
    startWith({key: ''}),
    map((e: any) => e.key)
  );


  private game$ = combineLatest([this.keys$, this.letters$]).pipe(
    scan<[string, Letters], State>((state, [key, letters]) => {

      (letters.letters[letters.letters.length - 1] && letters.letters[letters.letters.length - 1].letter === key)
        ? ((state.score++), (letters.letters.pop())) : this.noop();

      (state.score > 0 && state.score % this.levelThreshold === 0) ?
        ((state.letters = []), (state.level++), (state.score++),
          (this.letterInterval.next(letters.interval - this.speedAdjust))) : this.noop();


      return {level: state.level, score: state.score, letters: letters.letters}
    }, {level: 0, score: 0, letters: []}),
    takeWhile(state => state.letters.length < this.endThreshold)
  )

  ngOnInit() {
    this.game$.subscribe(this.renderGame.bind(this), this.noop, this.renderGameOver.bind(this));
  }

  private renderGame(state: State): void {
    this.score = state.score;
    this.level = state.level;

    let html = '';

    state.letters.forEach(l => {
      html += '&nbsp;'.repeat(l.xPos) + l.letter + '</br>';
    });

    this.html$.next(html);
  }

  private renderGameOver(): void {
    this.isGameOver = true;
  }

  private noop(): void {
  }

  private getRandomLetter(): string {
    return String.fromCharCode(Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0));
  }
}
