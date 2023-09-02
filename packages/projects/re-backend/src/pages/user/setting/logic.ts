import { JointState } from '@yhfu/re-gen';
import { delay, of } from 'rxjs';
import { ReRequest } from '@re-utils/re-request';

export const InfoCacheKey = 'User-Info';
export const SettingCacheKey = 'User-Setting';

export const InfoConfig = [
    {
        name: 'info',
        init: JointState(SettingCacheKey, 'update'),
        handle: () => ReRequest({ url: 'https://api.github.com/users/XDUyhfu' })
    }
] as const;

export const SettingConfig = [
    {
        name: 'update',
        handle: (value: any) => {
            return of(value).pipe(delay(2000));
        }
    }
] as const;
