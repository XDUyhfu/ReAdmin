import type { Subscription } from 'rxjs';
import { concatMap, of, expand, timer } from 'rxjs';

export class Timer {
    timerRequest: Subscription;

    constructor(second: number, callback: (...args: any[]) => void) {
        this.timerRequest = of(0)
            .pipe(
                expand(() =>
                    timer(second).pipe(
                        concatMap(() => {
                            callback();
                            return of(0);
                        })
                    )
                )
            )
            .subscribe();
    }

    cancel() {
        this.timerRequest.unsubscribe();
    }
}
