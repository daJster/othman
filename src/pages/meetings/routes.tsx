import type {RouteObject} from "react-router";
import {MeetingsPage} from "./MeetingsPage";

export const meetingsRoute: RouteObject = {
    path: '/kuttab',
    element: <MeetingsPage />,
};
