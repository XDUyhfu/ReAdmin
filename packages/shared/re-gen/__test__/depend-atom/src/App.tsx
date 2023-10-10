import { useReGen } from '../../../../re-hooks/src/index.ts';
import { ParamsConfig, ParamsKey, RequestConfig, RequestKey } from './config';
import { Button, Select } from 'antd';

function App() {
    const { result } = useReGen(RequestKey, RequestConfig, {
        logger: true,
        persist: {
            name: 'persist-name',
            storage: 'localStorage'
        }
        // destroyOnExit: false
    });
    const {
        param1,
        ReGenValue: { setValue: setParamsValue }
    } = useReGen(ParamsKey, ParamsConfig as any, {
        logger: true,
        persist: {
            name: 'persist-name',
            storage: 'localStorage'
        }
        // destroyOnExit: false
    });

    return (
        <div>
            {JSON.stringify(result?.data?.result?.login)}
            <br />
            <Select
                style={{ width: 200 }}
                value={param1}
                onChange={setParamsValue('param1')}
                options={[
                    { label: 'XDUyhfu', value: 'XDUyhfu' },
                    { label: 'p2', value: 'p2' }
                ]}></Select>
            <br />
            <Select
                style={{ width: 200 }}
                onChange={setParamsValue('param2')}
                options={[
                    { label: 'p3', value: 'p3' },
                    { label: 'p4', value: 'p4' }
                ]}></Select>
            <br />
            <Button onClick={setParamsValue('button')}>发起请求</Button>
        </div>
    );
}

export default App;
