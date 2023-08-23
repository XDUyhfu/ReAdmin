import type { ReRoute } from '@/routes/interface';
import { Info, Setting } from '@/pages/user';

export const routes: ReRoute[] = [
    {
        path: 'user',
        label: '用户',
        children: [
            {
                path: 'info',
                label: '详情',
                element: <Info />
            },
            {
                path: 'setting',
                label: '设置',
                element: <Setting />
            }
        ]
    }
];
