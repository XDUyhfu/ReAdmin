import { Space } from 'antd';
import { InfoPanel } from '@re-backend/pages/user/setting/info-panel';
import { SettingPanel } from '@re-backend/pages/user/setting/setting-panel';

export const Setting = () => {
    return (
        <Space direction="vertical" size="large" className="w-full">
            <InfoPanel />
            <SettingPanel />
        </Space>
    );
};
