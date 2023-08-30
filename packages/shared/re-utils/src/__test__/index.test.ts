import { TestScheduler } from 'rxjs/testing';
import { concatMap, EMPTY, expand, of, timer } from 'rxjs';
import { describe, it, expect } from 'vitest';

const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).deep.equal(expected);
});

describe('timer', () => {
    it('', () => {
        testScheduler.run((helpers) => {
            const { time, expectObservable } = helpers;
            const intervalTime = time('---|');
            const intervalTimer = of(0).pipe(
                expand(() =>
                    timer(intervalTime).pipe(
                        concatMap(() => {
                            // callback();
                            // return of(0);
                            return EMPTY;
                        })
                    )
                )
            );
            const expected = 'a--|';

            expectObservable(intervalTimer).toBe(expected, { a: 0 });
        });
    });
});
