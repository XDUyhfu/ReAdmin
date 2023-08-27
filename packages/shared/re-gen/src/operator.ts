import type { IConfigItem, IDistinct, ReGenConfig } from './type';
import type { BehaviorSubject, Observable } from 'rxjs';
import {
    bufferCount,
    catchError,
    combineLatestWith,
    distinctUntilChanged,
    EMPTY,
    filter,
    identity,
    map,
    ReplaySubject,
    switchMap,
    tap,
    timestamp,
    withLatestFrom,
    zipWith
} from 'rxjs';
import { compose, equals, is, isNil, not } from 'ramda';
import { FilterNilStage } from './config';
import { CombineType } from './config';
import {
    transformFilterNilOptionToBoolean,
    transformResultToObservable
} from './utils';
import { Global } from './store';
import type { OperatorReturnType } from './type';

const handleUndefined: (filterNil: boolean) => OperatorReturnType =
    (filterNil) => (source) =>
        filterNil ? source.pipe(filter(compose(not, isNil))) : source;

export const handleUndefinedWithStage: (
    item: IConfigItem,
    config?: ReGenConfig
) => (stage: FilterNilStage) => OperatorReturnType =
    (item, config) => (stage) => (source) =>
        source.pipe(
            handleUndefined(
                transformFilterNilOptionToBoolean(
                    stage,
                    item.filterNil ?? config?.filterNil
                )
            )
        );

export const handleDistinct =
    (
        distinct: IDistinct<any, any>
    ): ((source: Observable<any>) => Observable<any>) =>
    (source) => {
        if (is(Boolean, distinct)) {
            return distinct
                ? source.pipe(distinctUntilChanged(equals))
                : source;
        } else if (distinct) {
            return source.pipe(
                distinctUntilChanged(
                    distinct.comparator,
                    distinct.keySelector || identity
                )
            );
        } else {
            return source;
        }
    };

/**
 * 支持三种合并策略: withLatestFrom combineLatestWith zipWith
 * - 默认策略为 combineLatestWith
 * @param type
 * @param depends
 */
export const handleCombine =
    (type: CombineType, depends: BehaviorSubject<any>[]): OperatorReturnType =>
    (source) =>
        depends.length > 0
            ? type === CombineType.SELF_CHANGE
                ? source.pipe(withLatestFrom(...depends))
                : type === CombineType.EVERY_CHANGE
                ? source.pipe(zipWith(...depends))
                : source.pipe(combineLatestWith(...depends))
            : source;

const handleCombineWithBuffer =
    (
        CacheKey: string,
        name: string,
        dependNamesWithSelf: string[]
    ): OperatorReturnType =>
    (source) =>
        Global.Buffer.get(CacheKey)!.has(name)
            ? source.pipe(
                  tap((combineValue) =>
                      Global.Buffer.get(CacheKey)!.get(name)!.next(combineValue)
                  ),
                  zipWith(
                      Global.Buffer.get(CacheKey)!
                          .get(name)!
                          .pipe(bufferCount(2, 1))
                  ),
                  map(([current, beforeAndCurrent]) => {
                      const isChange: Record<string, boolean> = {};
                      dependNamesWithSelf?.forEach((name, index) => {
                          isChange[name] = not(
                              beforeAndCurrent?.[0]?.[index]?.timestamp
                                  ? equals(
                                        beforeAndCurrent?.[0]?.[index]
                                            ?.timestamp,
                                        beforeAndCurrent?.[1]?.[index]
                                            ?.timestamp
                                    )
                                  : equals(
                                        beforeAndCurrent?.[0]?.[index] ?? null,
                                        beforeAndCurrent?.[1]?.[index] ?? null
                                    )
                          );
                      });
                      return [current, isChange, beforeAndCurrent];
                  })
              )
            : source;

export const handleDependValueChange = (
    CacheKey: string,
    item: IConfigItem,
    dependsName: string[]
) => {
    // 使用额外的 BehaviorSubject 存储数据进行判断
    if (item.depend) {
        if (!Global.Buffer.get(CacheKey)!.has(item.name)) {
            const replay = new ReplaySubject<any[]>(2);
            Global.Buffer.get(CacheKey)!.set(item.name, replay);
            // 存储一个初始值 [] 作为初始值
            replay.next([]);
        }
    }
    return handleCombineWithBuffer(CacheKey, item.name, [
        item.name,
        ...dependsName
    ]);
};

export const handleError =
    (message: string): OperatorReturnType =>
    (source) =>
        source.pipe(
            catchError((e) => {
                console.error(message, e);
                return EMPTY;
            })
        );

export const handleLogger = (
    CacheKey: string,
    name: string,
    open?: { duration?: number } | boolean | number
): OperatorReturnType =>
    open ? Global.LoggerWatcher.get(CacheKey)!(`${name}`) : identity;

export const WithTimeout =
    (withTimestamp?: boolean): OperatorReturnType =>
    (source) =>
        withTimestamp ? source.pipe(timestamp()) : source;

const getProjectWithStage = (item: IConfigItem, stage: FilterNilStage) =>
    ({
        [FilterNilStage.InBefore]: identity,
        [FilterNilStage.In]: item?.interceptor?.before || identity,
        [FilterNilStage.HandleAfter]: item.handle || identity,
        [FilterNilStage.DependBefore]: identity,
        [FilterNilStage.DependAfter]: (
            value: [any, Record<string, boolean>, [any, any]]
        ) =>
            // current isChange beforeAndCurrent
            item?.depend?.handle?.(...value) ?? identity(value),
        [FilterNilStage.OutAfter]: item?.interceptor?.after || identity,
        [FilterNilStage.Out]: identity,
        [FilterNilStage.All]: identity,
        [FilterNilStage.Default]: identity
    }[stage] as (...args: any[]) => any);

const ErrorMessage = (name: string, stage: FilterNilStage) =>
    ({
        [FilterNilStage.InBefore]: '',
        [FilterNilStage.In]: `捕获到 ${name} item.interceptor.before 中报错`,
        [FilterNilStage.HandleAfter]: `捕获到 ${name} handle 中报错`,
        [FilterNilStage.DependBefore]: '',
        [FilterNilStage.DependAfter]: `捕获到 ${name} depend.handle 中报错`,
        [FilterNilStage.OutAfter]: '',
        [FilterNilStage.Out]: `捕获到 ${name} reduce 中报错`,
        [FilterNilStage.All]: '',
        [FilterNilStage.Default]: ''
    }[stage]);

export const handleTransformValue =
    (item: IConfigItem, config?: ReGenConfig) =>
    (stage: FilterNilStage): OperatorReturnType =>
    (source) =>
        getProjectWithStage(item, stage)
            ? source.pipe(
                  switchMap(transformResultToObservable),
                  map(getProjectWithStage(item, stage)),
                  handleError(ErrorMessage(item.name, stage)),
                  handleUndefinedWithStage(item, config)(stage),
                  switchMap(transformResultToObservable)
              )
            : source;
