// Компонент для защищенного роутинга

import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../store/authStore';


export function ProtectedRoute() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

    if (!isAuthenticated) {
        // Неавторизованного — на главную
        return <Navigate to="/" replace />;
    }

    // Авторизован — рендерим дочерний роут (UserProfile)
    return <Outlet />;
};
