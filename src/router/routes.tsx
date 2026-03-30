import type { RouteObject } from "react-router";

import { homeRoute } from "@/pages/home/route";
import {Navigate} from "react-router-dom";
import {ErrorGuardPage} from "@/router/guards";
import {SignInRoute} from "@/pages/auth";
import {meetingsRoute} from "@/pages/meetings/routes.tsx";

const publicRoutes: RouteObject[] = [
    homeRoute,
    SignInRoute
];

const privateRoutes: RouteObject[] = [
    meetingsRoute
]

const errorRoutes: RouteObject[] = [
    { path: "/error/:code", element: <ErrorGuardPage /> },
    { path: "*", element: <Navigate to="/error/404" replace /> }, // unknown paths
];

export const routes: RouteObject[] = [
    {
        path: "/",
        children: [
            ...publicRoutes,
            ...privateRoutes,
            // ...adminRoutes,
            ...errorRoutes,
        ],
    },
];