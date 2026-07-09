from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Админ может всё
        if request.user.is_staff or request.user.is_superuser:
            return True
        # Обычный пользователь — только свои объекты
        return obj.user == request.user