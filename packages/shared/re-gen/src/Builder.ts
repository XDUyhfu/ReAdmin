import { BehaviorSubject, filter, map, of, scan } from 'rxjs';
import { AtomInOut, AtomState, getOutObservable } from './Atom';
import {
    CheckParams,
    defaultReduceFunction,
    flatRelationConfig,
    getDependNames,
    isInit,
    isJointAtom,
    isValidRelationConfig,
    OpenLogger,
    transformDistinctOptionToBoolean
} from './utils';
import type {
    IAtomInOut,
    IConfigItem,
    IRelationConfig,
    ReGenConfig
} from './type';
import { forEach } from 'ramda';

import { CombineType, DefaultValue, FilterNilStage } from './config';
import {
    handleCombine,
    handleDependValueChange,
    handleDistinct,
    handleError,
    handleLogger,
    handleTransformValue,
    WithTimeout
} from './operator';
import { Global, InitGlobalValue } from './store';

/**
 * 该方法将每个配置项构建为一个 AtomState 并进行存储
 * @param CacheKey
 * @constructor
 */
const ConfigToAtomStore =
    (CacheKey: string) => (RelationConfig: IConfigItem[]) =>
        // 里面用到的 forEach 来自 ramda，它会将传入的参数返回
        forEach((item: IConfigItem) => {
            const jointName = `${DefaultValue.Prefix}:${CacheKey}:${item.name}`;
            let initValue = item.init;
            if (typeof item.init === 'function') {
                initValue = item.init();
            }
            const joint = isJointAtom(item.init);
            let observable = joint
                ? getOutObservable(joint[0])[joint[1]]
                : null;
            if (!observable && Array.isArray(joint)) {
                observable = new BehaviorSubject(null);
                if (Global.AtomBridge.has(item.init as string)) {
                    Global.AtomBridge.set(item.init as string, [
                        ...Global.AtomBridge.get(item.init as string)!,
                        observable
                    ]);
                } else {
                    Global.AtomBridge.set(item.init as string, [observable]);
                }
            }
            const atom = new AtomState(joint ? observable : initValue);
            if (Global.AtomBridge.has(jointName)) {
                Global.AtomBridge.get(jointName)!.forEach((observable) =>
                    atom.out$.subscribe(observable)
                );
            }
            Global.Store.get(CacheKey)!.set(item.name, atom);
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
                    filter((item) => !isJointAtom(item)),
                    transformValue(FilterNilStage.InBefore),
                    transformValue(FilterNilStage.In),
                    transformValue(FilterNilStage.HandleAfter)
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
            const dependNames = getDependNames(item);
            const dependAtomsOut$ = dependNames.map(
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
                    handleDependValueChange(CacheKey, item, dependNames),
                    transformValue(FilterNilStage.DependAfter),
                    scan(
                        item?.reduce?.handle || defaultReduceFunction,
                        item.reduce?.init
                    ),
                    transformValue(FilterNilStage.Out),
                    transformValue(FilterNilStage.OutAfter),
                    WithTimeout(item.withTimestamp ?? config?.withTimestamp),
                    handleDistinct(
                        transformDistinctOptionToBoolean(
                            config?.distinct,
                            item.distinct
                        )
                    ),
                    handleError(
                        `捕获到 ${item.name} item.interceptor.after 中报错`
                    ),
                    handleLogger(CacheKey, item.name, config?.logger)
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
) => {
    if (isInit(CacheKey) && isValidRelationConfig(RelationConfig)) {
        InitGlobalValue(CacheKey, RelationConfig);
        of(RelationConfig)
            .pipe(
                map(ConfigToAtomStore(CacheKey)),
                map(AtomHandle(CacheKey, config)),
                map(HandleDepend(CacheKey, config)),
                map(HandleInitValue(CacheKey, config))
            )
            .subscribe();
    }
};

export const ReGen = (
    CacheKey: string,
    RelationConfig: IRelationConfig,
    config?: ReGenConfig
): IAtomInOut => {
    const flatConfig = flatRelationConfig(CacheKey, RelationConfig);
    CheckParams(CacheKey, flatConfig, 'library');
    OpenLogger(CacheKey, config);
    BuildRelation(CacheKey, flatConfig, config);
    return AtomInOut(CacheKey, flatConfig);
};
