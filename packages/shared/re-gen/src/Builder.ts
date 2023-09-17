import {
    asyncScheduler,
    filter,
    map,
    of,
    scan,
    subscribeOn,
    takeUntil,
    tap
} from 'rxjs';
import { AtomInOut, getOutObservable } from './Atom';
import {
    CheckParams,
    defaultReduceFunction,
    flatRelationConfig,
    getDependNames,
    generateAndSaveAtom,
    isValidRelationConfig,
    OpenLogger,
    transformDistinctOptionToBoolean,
    subscribeDependAtom,
    isJointState,
    isInit
} from './utils';
import type {
    IAtomInOut,
    IConfigItem,
    IRelationConfig,
    ReGenConfig
} from './type';
import { forEach } from 'ramda';

import { CombineType, FilterNilStage } from './config';
import {
    handleCombine,
    handleDependValueChange,
    handleDistinct,
    handleError,
    handleLogger,
    handleTransformValue,
    WithTimestamp
} from './operator';
import { Global, InitGlobal } from './store';

/**
 * 该方法将每个配置项构建为一个 AtomState 并进行存储
 * @param CacheKey
 * @constructor
 */
const ConfigToAtomStore =
    (CacheKey: string) => (RelationConfig: IConfigItem[]) =>
        // 里面用到的 forEach 来自 ramda，它会将传入的参数返回
        forEach((item: IConfigItem) => {
            generateAndSaveAtom(CacheKey, item);
            // 如果是需要 depend atom 的话，需要进行订阅
            subscribeDependAtom(CacheKey, item);
        })(RelationConfig);

/**
 * 该过程用于执行状态自身的 handle 函数
 * @param CacheKey
 * @param config
 * @constructor
 */
const AtomHandle =
    (CacheKey: string, config?: ReGenConfig) =>
    (RelationConfig: IConfigItem[]) =>
        forEach((item: IConfigItem) => {
            const atom = Global.Store.get(CacheKey)!.get(item.name)!;
            const transformValue = handleTransformValue(item, config);
            atom.in$
                .pipe(
                    filter((item) => !isJointState(item)),
                    transformValue(FilterNilStage.InBefore),
                    transformValue(FilterNilStage.In),
                    transformValue(FilterNilStage.HandleAfter),
                    takeUntil(atom.destroy$)
                )
                .subscribe(atom.mid$);
        })(RelationConfig);

/**
 * 处理当前状态及其依赖状态, 当依赖状态值发生变化的时候，会根据相关策略进行计算新的状态值
 * @param CacheKey
 * @param config
 * @constructor
 */
const HandleDepend =
    (CacheKey: string, config?: ReGenConfig) =>
    (RelationConfig: IConfigItem[]) =>
        forEach((item: IConfigItem) => {
            const atom = Global.Store.get(CacheKey)!.get(item.name)!;
            const dependAtomsOut$ = getDependNames(item).map(
                (name) => Global.Store.get(CacheKey)!.get(name)!.out$
            );
            const transformValue = handleTransformValue(item, config);

            atom.mid$
                .pipe(
                    transformValue(FilterNilStage.DependBefore),
                    handleCombine(
                        item.depend?.combineType || CombineType.ANY_CHANGE,
                        dependAtomsOut$
                    ),
                    handleDependValueChange(CacheKey, item),
                    transformValue(FilterNilStage.DependAfter),
                    scan(
                        item?.reduce?.handle || defaultReduceFunction,
                        item.reduce?.init
                    ),
                    transformValue(FilterNilStage.Out),
                    transformValue(FilterNilStage.OutAfter),
                    WithTimestamp(item.timestamp ?? config?.timestamp),
                    handleDistinct(
                        transformDistinctOptionToBoolean(
                            config?.distinct,
                            item.distinct
                        )
                    ),
                    handleError(
                        `捕获到 ${item.name} item.interceptor.after 中报错`
                    ),
                    handleLogger(CacheKey, item.name, config?.logger),
                    takeUntil(atom.destroy$)
                )
                .subscribe(atom.out$);
        })(RelationConfig);

const HandleInitValue =
    (CacheKey: string, config?: ReGenConfig) =>
    (RelationConfig: IConfigItem[]) =>
        forEach((item: IConfigItem) => {
            if (!config?.init) {
                return;
            }
            const initValue = config.init?.[item.name];
            if (initValue) {
                const outObservable = getOutObservable(CacheKey, item.name);
                outObservable?.next(initValue);
            }
        })(RelationConfig);

/**
 * 构建的整体流程
 * @param CacheKey
 * @param RelationConfig
 * @param config
 * @constructor
 */
const BuildRelation = (
    CacheKey: string,
    RelationConfig: IConfigItem[],
    config?: ReGenConfig
) =>
    isInit(CacheKey) &&
    isValidRelationConfig(RelationConfig) &&
    of(RelationConfig)
        .pipe(
            subscribeOn(asyncScheduler),
            tap(() => OpenLogger(CacheKey, config)),
            tap(() => InitGlobal(CacheKey)),
            map(ConfigToAtomStore(CacheKey)),
            map(AtomHandle(CacheKey, config)),
            map(HandleDepend(CacheKey, config)),
            map(HandleInitValue(CacheKey, config))
        )
        .subscribe();

export const ReGen = (
    CacheKey: string,
    RelationConfig: IRelationConfig,
    config?: ReGenConfig
): IAtomInOut => {
    const flatConfig = flatRelationConfig(RelationConfig);
    CheckParams(CacheKey, flatConfig, 'library');
    BuildRelation(CacheKey, flatConfig, config);
    return AtomInOut(CacheKey);
};
