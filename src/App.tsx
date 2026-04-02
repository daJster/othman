import { BrowserRouter, useRoutes } from 'react-router-dom';

import { MainLayout } from '@/layouts';
import { routes } from '@/router';
import { AuthProvider, MeetingsProvider } from '@/providers';

const AppRoutes = () => {
    return useRoutes(routes);
};

function App() {
    return (
        <AuthProvider>
            <MeetingsProvider>
                <BrowserRouter>
                    <MainLayout>
                        <AppRoutes />
                    </MainLayout>
                </BrowserRouter>
            </MeetingsProvider>
        </AuthProvider>
    );
}

export default App;
