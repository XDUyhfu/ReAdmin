import { Button, Input } from 'antd';
import 'modern-normalize';
import './index.scss';
import styles from './form-filter.module.scss';

export const FormFilter = () => {
    return (
        <div className={styles.wrapper}>
            <Input />
            <Input />
            <Button type="primary">click me</Button>
        </div>
    );
};
