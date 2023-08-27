import { of } from 'rxjs';
import type { IConfigItem } from '../../../src';

export const Config: IConfigItem[] = [
    { name: 'add' },
    {
        name: 'test',
        depend: {
            names: ['add'],
            handle: () =>
                of({
                    value: Date.now(),
                    id: Date.now()
                })
        },
        reduce: {
            handle: (pre, val) => [...pre, val],
            init: []
        }
    },
    {
        name: 'inputValue',
        handle: (val) => of(val),
        distinct: false,
        depend: {
            names: ['add'],
            handle() {
                return of([]);
            }
        }
    },
    {
        name: 'result',
        init: of([{ key: 123 }]),
        distinct: false,
        depend: {
            names: ['add'],
            handle([]: [result: any[], add: any[], inputValue: any[]]) {
                return of([
                    {
                        value: Date.now(),
                        id: Date.now()
                    }
                ]);
            }
        }
    }
];