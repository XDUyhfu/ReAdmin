import { InfoPanel } from '@re-backend/pages/user/setting/InfoPanel.tsx';
import { SettingPanel } from '@re-backend/pages/user/setting/SettingPanel.tsx';
import { Space } from 'antd';

export const Setting = () => {
    return (
        <Space direction="vertical" size="large" className="w-full">
            <InfoPanel />
            <SettingPanel />
        </Space>
    );
};
