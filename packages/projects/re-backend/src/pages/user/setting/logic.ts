import type { IConfigItem } from '@yhfu/re-gen';
import { JointState } from '@yhfu/re-gen';
import axios from 'axios';
import { delay, of } from 'rxjs';

export const InfoCacheKey = 'User-Info';
export const SettingCacheKey = 'User-Setting';

export const InfoConfig: IConfigItem[] = [
    {
        name: 'info',
        init: JointState(SettingCacheKey, 'update'),
        handle: () => {
            return axios.get('https://api.github.com/users/XDUyhfu');
        }
    }
];

export const SettingConfig: IConfigItem[] = [
    {
        name: 'update',
        handle: (value: any) => {
            return of(value).pipe(delay(2000));
        }
    }
];
