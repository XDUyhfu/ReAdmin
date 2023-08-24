import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@re-backend/routes';
import './index.scss';
import 'modern-normalize';
import type { ReRoute } from '@re-backend/routes/interface';
import App from '@re-backend/App.tsx';
import { normalizeRoutePath } from '@re-backend/utils';

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
