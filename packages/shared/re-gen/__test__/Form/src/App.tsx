import { useReGen } from '../../../src';

import React from 'react';
import type { IItem } from './config';
import { ConfigItems } from './config';

import { Button, Input, Select, Space } from 'antd';

const App: React.FC = () => {
    const {
        Items,
        ItemNames,
        ReGenValue: { setValue }
    } = useReGen('FORM_CACHE_KEY', ConfigItems);

    return (
        <div>
            {JSON.stringify(Items)}
            <br />
            {JSON.stringify(ItemNames)}
            <br />

            <Button onClick={setValue('addItem')}>添加</Button>
            <br />
            <br />
            {Items?.filter((val: any) => val).map((item: IItem) => (
                <Space
                    style={{ marginTop: 10 }}
                    key={item?.id || Math.random().toString()}>
                    <Input
                        style={{ width: 160 }}
                        onChange={(value) => {
                            setValue('name', {
                                value: value.target.value,
                                id: item.id
                            });
                        }}
                        value={item?.name}
                        placeholder="name"
                    />
                    <Input style={{ width: 160 }} placeholder="init" />
                    <Input style={{ width: 160 }} placeholder="function" />
                    <Select
                        mode="multiple"
                        style={{ width: 160 }}
                        maxTagCount={1}
                        options={ItemNames?.filter(
                            (inner: string) => item?.name !== inner
                        )?.map((inner: string) => ({
                            label: inner,
                            value: inner
                        }))}
                    />
                    <Input style={{ width: 160 }} placeholder="function" />
                </Space>
            ))}
        </div>
    );
};

export default App;
