import type { BehaviorSubject } from 'rxjs';
import { useObservable } from 'rxjs-hooks';
import {
    PluckName,
    CheckParams,
    isPlainResult,
    isJointAtom,
    generateNameInHook,
    flatRelationConfig,
    ReGen,
    getOutObservable,
    getInObservable,
    getValue,
    setValue,
    DefaultValue
} from '@yhfu/re-gen';
import type {
    IConfigItem,
    IConfigItemInit,
    IRelationConfig,
    ReGenConfig
} from '@yhfu/re-gen';

interface IResultAtomsValue {
    [x: `${string}`]: any;
    ReGenValue: {
        getValue: {
            (): Record<string, any>;
            (name: string): any;
        };
        setValue: {
            (name: string): (value: any) => void;
            (name: string, value: any): void;
        };
    };
    ReGenObservable: {
        getInObservable: {
            (): Record<string, BehaviorSubject<any>>;
            (name: string): BehaviorSubject<any>;
        };
        getOutObservable: {
            (): Record<string, BehaviorSubject<any>>;
            (name: string): BehaviorSubject<any>;
        };
    };
}

type IResultRecordAtomsValue<
    RecordConfigItem extends Record<string, IConfigItem[] | IConfigItem[][]>
> = {
    [K in keyof RecordConfigItem]: {
        [y: `${string}`]: any;
        ReGenValue: {
            getValue: {
                (): Record<string, any>;
                (name: string): any;
            };
            setValue: {
                (name: string): (value: any) => void;
                (name: string, value: any): void;
            };
        };
        ReGenObservable: {
            getInObservable: {
                (): Record<string, BehaviorSubject<any>>;
                (name: string): BehaviorSubject<any>;
            };
            getOutObservable: {
                (): Record<string, BehaviorSubject<any>>;
                (name: string): BehaviorSubject<any>;
            };
        };
    };
};

const getRecordValue = (CacheKey: string, RecordKey: string) => ({
    ReGenValue: {
        getValue: (name?: string) =>
            getValue(CacheKey, generateNameInHook(RecordKey, name)),
        setValue: (name: string, value?: any) => {
            setValue(CacheKey, generateNameInHook(RecordKey, name)!, value);
        }
    },
    ReGenObservable: {
        getInObservable: (name?: string) =>
            getInObservable(CacheKey, generateNameInHook(RecordKey, name)),
        getOutObservable: (name?: string) =>
            getOutObservable(CacheKey, generateNameInHook(RecordKey, name))
    }
});

const getReValue = (CacheKey: string) => ({
    ReGenValue: {
        getValue: (name?: string) => getValue(CacheKey, name),
        setValue: (name: string, value?: any) => setValue(CacheKey, name, value)
    },
    ReGenObservable: {
        getInObservable: (name?: string) => getInObservable(CacheKey, name),
        getOutObservable: (name?: string) => getOutObservable(CacheKey, name)
    }
});

export function useReGen<P extends IConfigItem[] | IConfigItem[][]>(
    CacheKey: string,
    RelationConfig: P,
    config?: ReGenConfig
): IResultAtomsValue;
export function useReGen<
    RecordConfigItem extends Record<string, IConfigItem[] | IConfigItem[][]>
>(
    CacheKey: string,
    RelationConfig: RecordConfigItem,
    config?: ReGenConfig
): IResultRecordAtomsValue<RecordConfigItem>;
export function useReGen(
    CacheKey: string,
    RelationConfig: IRelationConfig,
    config?: ReGenConfig
): any {
    const flatConfig = flatRelationConfig(CacheKey, RelationConfig);
    CheckParams(CacheKey, flatConfig, 'hook');
    const AtomInOut = ReGen(CacheKey, flatConfig, config);
    const names = PluckName(flatConfig);
    const initMap = flatConfig.reduce(
        (pre, item) => ({
            ...pre,
            [`${item.name}`]: item.init
        }),
        {} as Record<string, IConfigItemInit>
    );

    const AtomsValue: IResultAtomsValue = names.reduce((pre, name) => {
        const inout = AtomInOut?.(name);
        // TODO 加上默认值
        return {
            ...pre,
            [`${name}`]: useObservable(
                () => inout?.[`${name}Out$`],
                isPlainResult(initMap[name])
                    ? // TODO 数据过滤
                      isJointAtom(initMap[name])
                        ? null
                        : initMap[name]
                    : null
            )
        };
    }, {} as IResultAtomsValue);

    if (!Array.isArray(RelationConfig)) {
        const result: Record<string, any> = {};
        Object.keys(RelationConfig).forEach((RecordKey) => {
            result[RecordKey] = { ...getRecordValue(CacheKey, RecordKey) };
            Object.keys(AtomsValue).forEach((valueName) => {
                const names = valueName.split(DefaultValue.Delimiter);
                if (RecordKey === names[0]) {
                    const key = names[1];
                    result[RecordKey][key] = AtomsValue[valueName];
                }
            });
        });
        return { ...result } as unknown as IResultRecordAtomsValue<
            typeof RelationConfig
        >;
    }

    return {
        ...AtomsValue,
        ...getReValue(CacheKey)
    } as unknown as IResultAtomsValue;
}
