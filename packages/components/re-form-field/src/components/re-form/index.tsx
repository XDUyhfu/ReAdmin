import type { FC, ReactNode } from 'react';
import type { IConfigItem } from '@re-gen/index';
import { ReGen } from '@re-gen/index';
import { CacheKey, ReFormContext } from '../../context';
import { mergeConfigAndReactChildren } from '../../utils';
import type { FormProps } from 'antd';
import { Form } from 'antd';

interface IReForm {
    config: IConfigItem[];
    initialValues?: Record<string, any>;
}

export const ReForm: FC<Omit<FormProps, 'initialValues'> & IReForm> = (
    props
) => {
    const { config, children, initialValues, ...rest } = props;
    const newConfig = mergeConfigAndReactChildren(
        children as ReactNode,
        config
    );
    ReGen(CacheKey, newConfig, {
        logger: true,
        init: initialValues
    });

    return (
        <ReFormContext.Provider value={initialValues ?? {}}>
            <Form {...rest}>{children as ReactNode}</Form>
        </ReFormContext.Provider>
    );
};
