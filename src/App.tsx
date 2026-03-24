import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { MainLayout } from '@/layouts';
import { routes } from '@/router';
import { AuthProvider } from '@/contexts';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <MainLayout>
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Routes>
                </MainLayout>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
