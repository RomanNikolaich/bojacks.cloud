from django.apps import AppConfig


class UsersFilesConfig(AppConfig):
    name = 'users_files'

class UsersFilesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users_files'
    
    def ready(self):
        # Импортируем сигналы, чтобы они зарегистрировались
        import users_files.signals  # noqa
        