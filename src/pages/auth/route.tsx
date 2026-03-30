import type {RouteObject} from "react-router";
import {SignInPage} from "@/pages/auth/signin.tsx";

export const SignInRoute: RouteObject = {
    path: '/signin',
    element: <SignInPage />,
};
