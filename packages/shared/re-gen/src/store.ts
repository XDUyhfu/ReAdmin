import type { BehaviorSubject, OperatorFunction } from 'rxjs';
import type { AtomState } from './Atom';

export const Global = {
    Store: new Map<string, Map<string, AtomState>>(),
    AtomBridge: new Map<string, BehaviorSubject<any>[]>(),
    LoggerWatcher: new Map<
        string,
        <T>(
            marbleName: string,
            selector?: ((value: T) => any) | undefined
        ) => OperatorFunction<T, T>
    >()
};

export const InitGlobal = (CacheKey: string) => {
    Global.Store.set(CacheKey, new Map<string, AtomState>());
};
