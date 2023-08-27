import { clone } from 'ramda';
import type { IConfigItem } from '../../../src';
import { FilterNilStage } from '../../../src';

export interface IItem {
    id: string;
    name: string;
    init?: any;
    handle?: string; // function string类型
    dependNames?: string[];
    dependHandle?: (val: string[]) => any;
}

function uniqueFunc(arr: any, val: string) {
    const res = new Map();
    return arr.filter(
        (item: any) => !res.has(item[val]) && res.set(item[val], 1)
    );
}

export const ConfigItems: IConfigItem[] = [
    {
        name: 'Items',
        depend: {
            names: ['addItem', 'name'],
            handle: ([_, addItem, name]) => ({
                item: addItem,
                updateName: name
            })
        },
        reduce: {
            handle: (
                pre: IItem[],
                val: { item: IItem; updateName: { id: string; value: string } }
            ) => {
                const index = pre?.findIndex(
                    (item) => item?.id === val.updateName?.id
                );

                const newPre = clone(pre);
                newPre[index] = {
                    ...newPre[index],
                    name: val?.updateName?.value
                };

                return uniqueFunc(
                    [...newPre, val.item].filter((item) => item),
                    'id'
                );
            },
            init: []
        }
    },
    {
        name: 'addItem',
        filterNil: FilterNilStage.In,
        handle() {
            return {
                id: Date.now().toString() + Math.random().toString().slice(4),
                name: ''
            };
        }
    },
    {
        name: 'ItemNames',
        depend: {
            names: ['Items'],
            handle: ([, Items]: [ItemName: string[], Items: IItem[]]) =>
                Items?.map((item) => item?.name)
        }
    },
    { name: 'name' }
];