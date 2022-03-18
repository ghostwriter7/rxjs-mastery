import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fromEvent, interval, map, Observable, scan, switchMap, takeWhile, tap } from 'rxjs';

interface State {
  score: number;
  interval: number;
}

@Component({
  selector: 'app-catch-the-dot',
  templateUrl: './catch-the-dot.component.html',
  styleUrls: ['./catch-the-dot.component.scss']
})
export class CatchTheDotComponent implements AfterViewInit {
  @ViewChild('dot', { static: true }) dot!: ElementRef;
  private game$!: Observable<any>;
  public score = 0;
  public isGameOver = false;

  ngAfterViewInit() {
    this.game$ = fromEvent(this.dot.nativeElement, 'mouseenter').pipe(
      tap(() => {
        this.dot.nativeElement.style.width = this.dot.nativeElement.style.height = '5px';
        this.dot.nativeElement.style.transform = `translate(${this.random()}px, ${this.random()}px`;
      }),
      scan<any, State>((acc) => {
        const newState = { score: acc.score + 1, interval: acc.score > 0 && acc.score % 3 === 0 ? acc.interval - 50 : acc.interval };
        this.score = newState.score
        return newState;
      }, { score: 0, interval: 500 }),
      switchMap((state) => {
        if (state.score % 3 === 0 && state.score >= 0) {
          this.dot.nativeElement.style.backgroundColor = '#' + Math.floor(Math.random()*16777215).toString(16);
        }
        this.dot.nativeElement.style.width = this.dot.nativeElement.style.height = '30px';

        return interval(state.interval).pipe(
          map((val) => 5 - val),
          tap((val) => {
            this.dot.nativeElement.innerText = val;
          })
        )
      }),
      takeWhile((val) => val > 0),);

    this.game$.subscribe({
      next: () => {},
      error: () => {},
      complete: () => this.isGameOver = true
    });
  }

  private random(): number {
    return Math.random() * 500;
  }
}
