import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/routes';
import './index.scss';
import 'modern-normalize';
import type { ReRoute } from '@/routes/interface';
import App from '@/App.tsx';
import { normalizeRoutePath } from '@/utils';

const defaultRootRoute: ReRoute = {
    path: '/',
    element: <App />,
    key: '/',
    children: normalizeRoutePath(routes)
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider
            router={createBrowserRouter([
                defaultRootRoute,
                {
                    path: '*'
                }
            ])}
        />
    </React.StrictMode>
);
