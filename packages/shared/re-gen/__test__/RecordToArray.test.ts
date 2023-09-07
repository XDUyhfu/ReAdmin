import { describe, expect } from 'vitest';

import { recordToArrayType } from '../src/utils';
import { DefaultValue } from '../src';

const Q1 = [{ name: 'Q1' }];
const Q2 = [{ name: 'Q2' }];

describe('Record Config To Array Config', () => {
    it('equals', () => {
        expect(recordToArrayType({ Q1, Q2 })).toEqual([
            {
                name: `Q1${DefaultValue.Delimiter}Q1`
            },
            {
                name: `Q2${DefaultValue.Delimiter}Q2`
            }
        ]);
    });
});
