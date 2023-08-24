import { TestScheduler } from 'rxjs/testing';
import { delay, of, take } from 'rxjs';

const testScheduler = new TestScheduler((actual, expected) => {
    // asserting the two objects are equal - required
    // for TestScheduler assertions to work via your test framework
    // e.g. using chai.
    expect(actual).deep.equal(expected);
});

describe('useDelay', () => {
    it('3秒钟之后获取到结果为true', () => {
        testScheduler.run((helpers) => {
            const { time, expectObservable } = helpers;
            const delayTime = time('---|');
            const useDelay = of(true).pipe(delay(delayTime), take(1));
            const expected = '---(a|)';

            expectObservable(useDelay).toBe(expected, {
                a: true
            });
        });
    });
});
