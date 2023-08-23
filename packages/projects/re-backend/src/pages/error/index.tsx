import { useRouteError } from 'react-router-dom';
import { Button, Result } from 'antd';

export const ErrorPage = () => {
    const error = useRouteError() as any;

    return (
        <Result
            className="h-full"
            status="404"
            title="404"
            subTitle={error?.statusText || error?.message}
            extra={<Button type="primary">Back Home</Button>}
        />
    );
};
