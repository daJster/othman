import {BrowserRouter, useRoutes} from 'react-router-dom';

import { MainLayout } from '@/layouts';
import { routes } from '@/router';
import {AuthProvider} from "@/contexts/auth-context.tsx";

const AppRoutes = () => {
    return useRoutes(routes);
};


function App() {

    return (
        <AuthProvider>
            <BrowserRouter>
                <MainLayout>
                    <AppRoutes />
                </MainLayout>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
