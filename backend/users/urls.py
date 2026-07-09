from django.urls import path
from .views import UsersSignUpView, UsersLogInView, GetUsersView, PatchUsersView, DeleteUsersView, AdminCreateUserView


urlpatterns = [
    path('signup/', UsersSignUpView.as_view(), name='signup'), # Путь для регистарции
    path('login/', UsersLogInView.as_view(), name='login'), # Путь для входа
    path('get_users/', GetUsersView.as_view(), name='get-users'), # Получение списка пользователей администратором
    path('delete_users/<int:pk>/', DeleteUsersView.as_view(), name='delete-users'), # Удаление пользователя администратором
    path('change_status/<int:pk>/', PatchUsersView.as_view(), name='change-status'), # Изменение статуса пользователя администратором
    path('create_user/', AdminCreateUserView.as_view(), name='admin_create_user'),  # Админ создает нового пользователя
]