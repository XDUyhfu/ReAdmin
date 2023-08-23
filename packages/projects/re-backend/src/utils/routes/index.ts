import type { ReRoute } from '@/routes/interface';

/**
 * 删除字符串中开头的Slash /
 * @param path
 */
export const removeStartSlash = (path: string) => path.replace(/^\//, '');

export const normalizeRoutePath = (routes: ReRoute[]) => {
    routes.forEach((route) => {
        route.path = removeStartSlash(route.path);
        if (Array.isArray(route.children)) {
            normalizeRoutePath(route.children);
        }
    });
    return routes;
};
