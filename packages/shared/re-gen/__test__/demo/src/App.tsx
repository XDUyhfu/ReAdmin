import { useReGen } from '@yhfu/re-hooks';
import { Config, RelationConfig, RelationConfig2 } from './config';
import { Button, Select } from 'antd';

function App() {
    const {
        RelationConfig: {
            area,
            region,
            showRegion,
            RegionList,
            testMoreDepend,
            showChange,
            ReGenValue: { setValue }
        },
        Config: {
            value,
            ReGenValue: { setValue: setConfigValue }
        }
    } = useReGen(
        'CACHE_KEY',
        {
            RelationConfig,
            RelationConfig2,
            Config
        },
        { logger: true }
    );

    return (
        <div>
            <div>areaValue: {JSON.stringify(area)}</div>
            <div>regionValue: {JSON.stringify(region)}</div>
            <div>showRegionValue: {JSON.stringify(showRegion)}</div>
            <div>RegionListValue: {JSON.stringify(RegionList)}</div>
            <div>testMoreDependValue: {JSON.stringify(testMoreDepend)}</div>
            <div>{JSON.stringify(showChange)}</div>
            <div></div>

            <br />

            <Select
                style={{ width: 120 }}
                onChange={(val) => {
                    setValue('area', Promise.resolve(val));
                }}
                value={area}
                placeholder="area"
                options={[
                    {
                        value: 'AP1',
                        label: '亚太1区'
                    },
                    {
                        value: 'AP2',
                        label: '亚太2区'
                    },
                    {
                        value: 'CN',
                        label: '中国大陆'
                    }
                ]}
            />

            <br />

            {showRegion ? (
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: 120 }}
                    placeholder="region"
                    onChange={setValue('region')}
                    options={[
                        {
                            value: 'BJ',
                            label: '北京'
                        },
                        {
                            value: 'SH',
                            label: '上海'
                        },
                        {
                            value: 'GZ',
                            label: '广州'
                        },
                        {
                            value: 'SZ',
                            label: '深圳'
                        }
                    ]}
                />
            ) : null}

            <br />
            <br />
            <Button
                type="primary"
                onClick={() => setValue('showRegion', Date.now())}>
                获取最新值
            </Button>

            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div>计算值{JSON.stringify(value)}</div>
            <Button onClick={() => setConfigValue('add', 1)}>+1</Button>
            <Button onClick={() => setConfigValue('sub', 1)}>-1</Button>
        </div>
    );
}

export default App;
