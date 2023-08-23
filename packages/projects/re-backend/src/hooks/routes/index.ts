import type { ReRoute } from '@/routes/interface';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { removeStartSlash } from '@/utils';

const MaxMenuDeep = 3;

const addKeyProp = (routes: ReRoute[], path = '/', deep = 1) => {
    routes.forEach((route) => {
        const key = `${path}/${removeStartSlash(route.path)}`.replace(
            /^\/\//,
            '/'
        );
        route.key = key;
        if (Array.isArray(route.children)) {
            // 如果有 children 的话，element 不能包含其他元素
            route.element = null;
            if (deep + 1 <= MaxMenuDeep) {
                addKeyProp(route.children, key, deep + 1);
            } else {
                Reflect.deleteProperty(route, 'children');
            }
        }
    });
    return routes;
};

export const useRoutes = (routes: ReRoute[]) => {
    const [openKeys, setOpenKeys] = useState<string[]>();
    const refRoutes = useRef(routes);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const keys = location.pathname.split('/').filter(Boolean);
        const k = keys?.map((_, index, arr) => {
            return '/' + [...arr].slice(0, index).join('/');
        });
        setOpenKeys(k);
    }, [location.pathname]);

    return {
        openKeys,
        setOpenKeys,
        menu: addKeyProp(refRoutes.current),
        navigate,
        selectedKeys: [location.pathname]
    };
};
