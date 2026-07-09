// Компонент для перенаправления пользователя

import { Navigate } from 'react-router';
import { useAuthStore } from '../../store/authStore';

// Если пользователь вручную введет /user в адресной строке, 
// то его автоматически перенаправит его старницу либо на стартовую

export function UserRedirect() {
    const user = useAuthStore((state) => state.user);
    
    // Если пользователь есть — редиректим на его профиль
    if (user?.username) {
        return <Navigate to={`/user/${user.username}`} replace />;
    }
    
    // Если пользователя нет (не должен произойти из-за ProtectedRoute)
    return <Navigate to="/" replace />;
};
