import { of, delay, take } from 'rxjs';
import { useObservable } from 'rxjs-hooks';

export const useDelay = (delayTime = 2000) => {
    const observable = of(true).pipe(delay(delayTime), take(1));
    return useObservable(() => observable, false);
};
