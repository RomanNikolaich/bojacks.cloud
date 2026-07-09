from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'users'


class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'  # ← имя вашего приложения

    def ready(self):
        # Импортируем сигналы, чтобы они зарегистрировались
        import users.signals  # ← замените на имя вашего приложения