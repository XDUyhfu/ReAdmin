import { FormFilter } from '@re-form-filter/component/form-filter.tsx';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
describe('Form-Filter', () => {
    it('组件中包含 primary button', () => {
        const { container } = render(<FormFilter />, {});
        expect(container.querySelector('.ant-btn-primary')).toBeInTheDocument();
    });
});
