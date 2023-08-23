import { Card, Tabs } from 'antd';

export const SettingPanel = () => {
    return (
        <Card>
            <Tabs
                tabPosition="left"
                activeKey="0"
                items={['基本信息', '安全设置', '实名认证'].map(
                    (label, key) => ({
                        label,
                        key: key.toString(),
                        children: (
                            <div>
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                            </div>
                        )
                    })
                )}
            />
        </Card>
    );
};
