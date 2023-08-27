import { Button, Input, Switch } from 'antd';
import { useReGen } from '../../../src';

import { Config } from './config';

function App() {
    const {
        result,
        ReGenValue: { setValue }
    } = useReGen('key', Config);

    return (
        <div>
            <div>{JSON.stringify(result)}</div>
            <div>{JSON.stringify(Array.isArray(result))}</div>
            {result?.map(
                (item: { value: string; id: string }, index: number) => (
                    <div key={item.id}>
                        <Input
                            value={item.value}
                            onChange={(val) => {
                                setValue('inputValue', {
                                    index,
                                    value: val.target.value
                                });
                            }}
                            width="300px"></Input>
                        <Switch checked></Switch>
                    </div>
                )
            )}

            <br />
            <br />
            <Button type="primary" onClick={setValue('add')}>
                添加
            </Button>
        </div>
    );
}

export default App;