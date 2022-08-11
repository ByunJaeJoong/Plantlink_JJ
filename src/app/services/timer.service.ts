import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { take, map, takeWhile } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class TimerService {
  completion;
  timer;
  constructor() { }

  countdown(minutes: number, delay: number = 0) {
    return new Observable<{ display: string; minutes: number; seconds: number; complete: number }>(subscriber => {
      this.timer = timer(delay, 1000)
        .pipe(take(minutes * 60))
        .pipe(map(v => minutes * 60 - 1 - v))
        .pipe(takeWhile(x => x >= 0))
        .subscribe(countdown => {
          // countdown => seconds
          const minutes = Math.floor(countdown / 60);
          const seconds = countdown - minutes * 60;
          let complete = 0;

          subscriber.next({
            display: `${('0' + minutes.toString()).slice(-2)}:${('0' + seconds.toString()).slice(-2)}`,
            minutes,
            seconds,
            complete,
          });

          if (seconds <= 1 && minutes <= 0) {
            complete = 1;
          }

          if (seconds <= 0 && minutes <= 0) {
            subscriber.complete();
          }
        });
    });
  }

  stop() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }
}
