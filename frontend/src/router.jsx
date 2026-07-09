import { createBrowserRouter } from 'react-router';
import { CommonCloudTemplate } from './components/CommonCloudTemplate/CommonCloudTemplate';
import { GreetingPage } from './components/GreetingPage/GreetingPage';
import { UserProfile } from './components/UserProfile/UserProfile';
import { UserRedirect } from './components/UserRedirect/UserRedirect';
import { AdminProfile } from './components/AdminProfile/AdminProfile';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { NotFound } from './components/NotFound/NotFound';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <CommonCloudTemplate />,
        children: [
            { index: true, element: <GreetingPage /> },
            { path: 'signup', element: <GreetingPage /> },
            { path: 'login', element: <GreetingPage /> },
            
            // Защищённый роут — только для авторизованных
            {
                element: <ProtectedRoute />,
                children: [
                    // Динамический параметр :login
                    { path: 'user/:login', element: <UserProfile /> },
                    { path: 'user/:login/add_file', element: <UserProfile /> },
                    
                    // Редирект с /user на /user/:login
                    { path: 'user', element: <UserRedirect /> },
                    
                    // Для админов
                    { path: 'admin', element: <AdminProfile /> },
                    { path: 'admin/add_file', element: <AdminProfile /> },
                    { path: 'admin/signup', element: <AdminProfile /> },
                ]
            },
            
            { path: '*', element: <NotFound /> },
        ],
    },
]);
