import { BehaviorSubject, ReplaySubject } from 'rxjs';
import type { AtomsType, IConfigItem } from './type';
import { Global } from './store';
import { isNil } from 'ramda';
import { isValidRelationConfig } from './utils';

export class AtomState {
    in$: BehaviorSubject<any>;
    mid$: ReplaySubject<any>;
    out$: BehaviorSubject<any>;

    replay$: ReplaySubject<any[]> | null = null;
    destroy$: ReplaySubject<any>;

    constructor(init: any, hasDepend = false) {
        this.in$ = new BehaviorSubject(init);
        this.mid$ = new ReplaySubject(0);
        this.out$ = new BehaviorSubject(null);

        // 销毁时使用的
        this.destroy$ = new ReplaySubject(0);

        // 如果有依赖的话，记录变化前后的数据
        if (hasDepend) {
            this.replay$ = new ReplaySubject<any[]>(2);
            this.replay$.next([]);
        }
    }
}

/**
 * 通过判断 RelationConfig 是否有效，返回不同的处理函数
 * 主要是考虑到配置文件异步加载的情况，可能会导致后续的操作报错的问题
 * @param CacheKey
 * @param RelationConfig
 * @constructor
 */
export const AtomInOut = (CacheKey: string, RelationConfig: IConfigItem[]) =>
    isValidRelationConfig(RelationConfig)
        ? <T = any>(name: string) => {
              const atom = Global.Store.get(CacheKey)!.get(name)!;
              if (!atom) {
                  throw new Error(`用于构建的配置列表中不包含该 ${name} 值`);
              }
              return {
                  [`${name}In$`]: atom.in$,
                  [`${name}Out$`]: atom.out$
              } as {
                  [x: `${string}In$`]: BehaviorSubject<T>;
                  [x: `${string}Out$`]: BehaviorSubject<T>;
              };
          }
        : () => ({});

const GetCurrentAtomValues = (cacheKey: string): Record<string, any> => {
    const observables = GetAtomOutObservables(cacheKey);
    const result = {} as Record<string, any>;
    Object.keys(observables).forEach((key) => {
        result[key] = observables[key].getValue();
    });
    return result;
};

const GetCurrentAtomValueByName = (CacheKey: string, name: string) =>
    GetCurrentAtomValues(CacheKey)[name];

const GetAtomOutObservables = (
    CacheKey: string
): Record<string, BehaviorSubject<any>> => {
    const result = {} as AtomsType;
    if (Global.Store.has(CacheKey)) {
        const entries = Global.Store.get(CacheKey)!.entries();
        for (const [key, value] of entries) {
            result[key] = value.out$;
        }
    }
    return result;
};

const GetAtomOutObservableByName = (
    CacheKey: string,
    name: string
): BehaviorSubject<any> => GetAtomOutObservables(CacheKey)[name];

const GetAtomInObservables = (
    CacheKey: string
): Record<string, BehaviorSubject<any>> => {
    const result = {} as AtomsType;
    if (Global.Store.has(CacheKey)) {
        const entries = Global.Store.get(CacheKey)!.entries();
        for (const [key, value] of entries) {
            result[key] = value.in$;
        }
    }
    return result;
};

const GetAtomInObservableByName = (
    CacheKey: string,
    name: string
): BehaviorSubject<any> => GetAtomInObservables(CacheKey)[name];

const SetAtomValueByName = (CacheKey: string) => (name: string, value: any) =>
    GetAtomInObservables(CacheKey)?.[name]?.next(value);

export function getValue(CacheKey: string): Record<string, any>;
export function getValue(CacheKey: string, name?: string): any;
export function getValue(CacheKey: string, name?: string) {
    if (name) {
        return GetCurrentAtomValueByName(CacheKey, name);
    }
    return GetCurrentAtomValues(CacheKey);
}

export function getOutObservable(
    CacheKey: string
): Record<string, BehaviorSubject<any>>;
export function getOutObservable(
    CacheKey: string,
    name?: string
): BehaviorSubject<any>;
export function getOutObservable(CacheKey: string, name?: string) {
    if (name) {
        return GetAtomOutObservableByName(CacheKey, name);
    }
    return GetAtomOutObservables(CacheKey);
}

export function getInObservable(
    CacheKey: string
): Record<string, BehaviorSubject<any>>;
export function getInObservable(
    CacheKey: string,
    name?: string
): BehaviorSubject<any>;
export function getInObservable(CacheKey: string, name?: string) {
    if (name) {
        return GetAtomInObservableByName(CacheKey, name);
    }
    return GetAtomInObservables(CacheKey);
}

export function setValue(CacheKey: string, name: string): (value: any) => void;
export function setValue(CacheKey: string, name: string, value?: any): void;
export function setValue(CacheKey: string, name: string, value?: any) {
    if (!isNil(value)) {
        SetAtomValueByName(CacheKey)(name, value);
        return;
    }
    return (value: any) => {
        SetAtomValueByName(CacheKey)(name, value);
    };
}
