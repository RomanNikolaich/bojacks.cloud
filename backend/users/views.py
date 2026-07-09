import logging

from django.contrib.auth import get_user_model
from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView
from .serializers import UsersRegisterSerializer, CustomTokenObtainPairSerializer, ChangeUserStatusSerializer, UsersListSerializer


User = get_user_model()
logger = logging.getLogger(__name__)


# Регистрация пользователя
class UsersSignUpView(APIView):
    def post(self, request):
        serializer = UsersRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            # 1. Сначала создаём пользователя
            user = serializer.save()
            logger.info(f"Новый пользователь зарегистрирован: {user.username} (id={user.id})")

            # 2. Только ПОСЛЕ этого генерируем токен
            refresh = RefreshToken.for_user(user)
            
            # 3. Возвращаем данные пользователя и токены
            return Response({
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_superuser': user.is_superuser,  # ← ДОБАВИТЬ
                    'is_staff': user.is_staff, 
                },
                'access': str(refresh.access_token),   # ← access токен
                'refresh': str(refresh),                # ← refresh токен
            }, status=status.HTTP_201_CREATED)
        
        # Если есть ошибки валидации, вернем их
        logger.warning(f"Ошибка регистрации: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Регистрация пользователя администратором
class AdminCreateUserView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        serializer = UsersRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info(f"Новый пользователь зарегистрирован админом: {user.username} (id={user.id})")
            # НЕ возвращаем токены — просто подтверждаем создание
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }, status=status.HTTP_201_CREATED)
        logger.warning(f"Ошибка регистрации: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

# Вход в профиль
class UsersLogInView(APIView):
    def post(self, request):
        serializer = CustomTokenObtainPairSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            logger.info(f"Пользователь вошел: {user.get('username')} (id={user.get('id')})")
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        
        logger.warning(f"Неудачная попытка входа: {request.data.get('username', 'не указан')}")
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


# Получение всех пользователей админом
class GetUsersView(ListAPIView):
    serializer_class = UsersListSerializer
    permission_classes = [IsAdminUser]  # Только админы
    
    def get_queryset(self):
        logger.info(f"Админ {self.request.user.username} (id={self.request.user.id}) запросил список пользователей")
        return User.objects.annotate(
            files_count=Count('files')
        ).order_by('-id')
    

# Изменение прав пользователя администратором
class PatchUsersView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ChangeUserStatusSerializer
    permission_classes = [IsAdminUser]
    
    def get_serializer(self, *args, **kwargs):
        # Автоматически включаем partial=True для PATCH
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        admin = self.request.user
        logger.info(f"Админ {admin.username} (id={admin.id}) обновил статус пользователя {instance.username} (id={instance.id})")

    
# Удаление пользователя администратором
class DeleteUsersView(DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UsersRegisterSerializer
    permission_classes = [IsAdminUser]

    def perform_destroy(self, instance):
        admin = self.request.user
        logger.info(f"Админ {admin.username} (id={admin.id}) удалил пользователя {instance.username} (id={instance.id})")
        super().perform_destroy(instance)
