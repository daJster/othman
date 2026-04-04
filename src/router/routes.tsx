import type { RouteObject } from 'react-router';

import { MainLayout, MinimalLayout } from '@/layouts';
import { homeRoute } from '@/pages/home/route';
import { Navigate } from 'react-router-dom';
import { ErrorGuardPage } from '@/router/guards';
import { SignInRoute, LogoutRoute } from '@/pages/auth';
import { meetingsRoute } from '@/pages/meetings/routes.tsx';
import { AccountPage } from '@/pages/account';

const publicRoutes: RouteObject[] = [homeRoute, SignInRoute, LogoutRoute];

const privateRoutes: RouteObject[] = [meetingsRoute];

const errorRoutes: RouteObject[] = [
    { path: '/error/:code', element: <ErrorGuardPage /> },
    { path: '*', element: <Navigate to="/error/404" replace /> },
];

export const routes: RouteObject[] = [
    {
        element: <MainLayout />,
        children: [...publicRoutes, ...privateRoutes, ...errorRoutes],
    },
    {
        element: <MinimalLayout />,
        children: [{ path: '/account', element: <AccountPage /> }],
    },
];
