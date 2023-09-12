import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    distinctUntilChanged,
    finalize,
    of,
    retry,
    switchMap,
    tap,
    throttleTime,
    combineLatestWith,
    map,
    startWith,
    delay
} from 'rxjs';
import { mergeDeepRight, equals } from 'ramda';

interface ReRequestConfig {
    time: {
        debounce: number;
        throttle: number;
        delay: number;
    };
    retry: {
        count: number;
        delay: number;
    };
    value: {
        default: any;
        init: any;
    };
}

const DefaultReRequestConfig: ReRequestConfig = {
    time: {
        debounce: 0,
        throttle: 0,
        delay: 4000
    },
    retry: {
        count: 2,
        delay: 1000
    },
    value: {
        default: null,
        init: null
    }
};

export const ReRequest = (
    AxiosConfig: AxiosRequestConfig,
    ReConfig: ReRequestConfig = {} as ReRequestConfig
) => {
    const reConfig = mergeDeepRight(DefaultReRequestConfig, ReConfig);
    const loading$ = new BehaviorSubject(false);

    const request$ = of(AxiosConfig).pipe(
        // TODO 这个方法好像没有生效？
        distinctUntilChanged((pre, cur) => equals(pre, cur)),
        tap(() => loading$.next(true)),
        throttleTime(reConfig.time.throttle),
        debounceTime(reConfig.time.debounce),
        delay(reConfig.time.delay),
        switchMap(axios.request),
        retry({
            count: reConfig.retry.count,
            delay: reConfig.retry.delay,
            resetOnSuccess: true
        }),
        catchError((e) => {
            console.error('re-request: ', e);
            return of(reConfig.value.default);
        }),
        finalize(() => loading$.next(false)),
        startWith(reConfig.value.init)
    );

    return request$.pipe(
        combineLatestWith(loading$),
        map(([data, loading]) => ({
            data,
            loading
        }))
    );
};
