from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class UsersRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    first_name = serializers.CharField(required=True, label="Имя")
    last_name = serializers.CharField(required=True, label="Фамилия")
    
    class Meta:
        model = User
        fields = ('username', 'email', 'id', 'password', 'first_name', 'last_name', 'is_superuser', 'is_staff')

    def create(self, validated_data):
        password = validated_data.pop('password')
        username = validated_data.get('username')
        
        # Явно игнорируем попытки подмены прав (если фронтенд их передаст)
        validated_data.pop('is_staff', None)
        validated_data.pop('is_superuser', None)
        
        user = User.objects.create_user(
            storage_path=f"users/{username}/",
            password=password,
            is_staff=False,        # Явно указываем обычный статус
            is_superuser=False,    # Явно указываем обычный статус
            **validated_data 
        )
        return user
    
    def update(self, instance, validated_data):
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.save()
        return instance
    
    
class UsersListSerializer(serializers.ModelSerializer):
    """Сериализатор для списка пользователей (для админа)."""
    
    # 🆕 Поле для количества файлов (заполняется через annotate в view)
    files_count = serializers.IntegerField(read_only=True, default=0)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                  'is_superuser', 'is_staff', 'files_count')
        

class AddStoragePathForSuperUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('storage_path')
        

class CustomTokenObtainPairSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)
        
        if not user:
            raise serializers.ValidationError('Неверный логин или пароль')

        refresh = RefreshToken.for_user(user)

        return {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
    
class ChangeUserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('is_staff',)
    
    def validate_is_staff(self, value):
        if self.instance.is_superuser and not value:
            raise serializers.ValidationError("Нельзя снять статус с суперпользователя через этот эндпоинт")
        return value