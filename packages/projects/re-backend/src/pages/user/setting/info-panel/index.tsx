import { Avatar, Card, Col, Descriptions, Row, Skeleton } from 'antd';
import type { DescriptionsProps } from 'antd';
import { useDelay, useReGen } from '@re-hooks/index';
import {
    InfoCacheKey,
    InfoConfig
} from '@re-backend/pages/user/setting/logic.ts';

const items: DescriptionsProps['items'] = [
    {
        key: '1',
        label: '用户名',
        children: 'yhfu'
    },
    {
        key: '2',
        label: '电话',
        children: '1810000000'
    },
    {
        key: '3',
        label: '地址',
        children: '上海市闵行区'
    },
    {
        key: '4',
        label: '评论',
        children: '暂无'
    },
    {
        key: '5',
        label: '地址',
        children: '莲花路755弄'
    }
];

export const InfoPanel = () => {
    const delayResult = useDelay(1000);
    const { info } = useReGen(InfoCacheKey, InfoConfig);

    console.log(info);

    return (
        <Card>
            <Row align="middle">
                {delayResult ? (
                    <>
                        <Col span={6} offset={2}>
                            <Avatar
                                size={100}
                                src={
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    info?.data?.avatar_url ||
                                    'https://xsgames.co/randomusers/avatar.php?g=pixel&key=3'
                                }
                            />
                        </Col>
                        <Col span={16}>
                            <Descriptions title="个人信息" items={items} />
                        </Col>
                    </>
                ) : (
                    <Col span={24}>
                        <Skeleton avatar paragraph={{ rows: 2 }} />
                    </Col>
                )}
            </Row>
        </Card>
    );
};
