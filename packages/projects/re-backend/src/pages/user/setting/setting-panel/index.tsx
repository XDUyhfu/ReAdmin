import { Button, Card, Tabs } from 'antd';
import { useReGen } from '@re-hooks/re-gen';
import {
    SettingCacheKey,
    SettingConfig
} from '@re-backend/pages/user/setting/logic.ts';

export const SettingPanel = () => {
    const {
        ReGenValue: { setValue }
    } = useReGen(SettingCacheKey, SettingConfig);
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
                                <Button
                                    onClick={(e) => {
                                        setValue('update', e);
                                    }}>
                                    更新信息
                                </Button>
                            </div>
                        )
                    })
                )}
            />
        </Card>
    );
};
