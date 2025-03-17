import { lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Layout from '../layout';

// Lazy load pages
const HomePage = lazy(() => import('@/components/CameraGrid'));
const AlertPage = lazy(() => import('@/components/AlertsList'));

const routes: RouteObject[] = [

    {
        path: '/',
        element: (
            <Layout>
                <HomePage />
            </Layout>
        )

    },
    {
        path: '/alerts',
        element: (
            <Layout>
                <AlertPage />
            </Layout>
        )

    },


];

export const router = createBrowserRouter(routes);

export default router;