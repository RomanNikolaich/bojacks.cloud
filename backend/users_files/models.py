import os

from django.db import models
import uuid


# Используем строковое указание на модель, чтобы избежать ошибок циклического импорта
# Убедитесь, что приложение называется 'users', а модель 'Users'

def get_file_storage_path(instance, filename):
    """
    Функция для динамического формирования пути сохранения файла.
    """
    # Получаем расширение оригинального файла
    ext = filename.split('.')[-1]
    
    # Генерируем уникальное имя файла, чтобы избежать конфликтов имен в хранилище
    unique_filename = f"{uuid.uuid4().hex}.{ext}"
    
    # Формируем путь: папка пользователя / уникальное_имя.расширение
    # instance.user.storage_path берется из связанной модели Users
    return os.path.join(instance.user.storage_path, unique_filename)


class UsersFiles(models.Model):
    # related_name='files' логичнее, чем 'owners', так как мы получаем файлы пользователя: user.files.all()
    user = models.ForeignKey(
        'users.Users', 
        on_delete=models.CASCADE, 
        related_name='files'
    )
    
    name = models.CharField(max_length=255, verbose_name="Оригинальное имя файла")
    
    # Размер файла лучше хранить в байтах как целое число, а не Decimal
    size = models.PositiveBigIntegerField(verbose_name="Размер (в байтах)")
    
    # DateTimeField предпочтительнее DateField, так как сохраняет и время
    upload_date = models.DateTimeField(auto_now_add=True, verbose_name="Дата загрузки")
    
    # auto_now=True обновляет дату при ЛЮБОМ сохранении модели (даже при изменении комментария).
    # Лучше сделать поле nullable и обновлять его вручную только в момент скачивания (в View).
    last_download_date = models.DateTimeField(null=True, blank=True, verbose_name="Дата последнего скачивания")
    
    # default="" корректнее для TextField, чем default=False
    comment = models.TextField(blank=True, default="", verbose_name="Комментарий", null=True)
    
    # FileField автоматически сохранит файл по пути, который вернет get_file_storage_path
    # и запишет этот относительный путь в базу данных
    file = models.FileField(
        upload_to=get_file_storage_path, 
        verbose_name="Путь к файлу в хранилище"
    )
    
    # UUIDField автоматически сгенерирует уникальный токен при создании записи
    special_link = models.UUIDField(
        default=uuid.uuid4, 
        editable=False, # Запрещаем ручное изменение в админке
        unique=True, 
        verbose_name="Токен специальной ссылки"
    )

    class Meta:
        verbose_name = "Файл пользователя"
        verbose_name_plural = "Файлы пользователей"
        # Полезно добавить индекс по special_link для быстрого поиска при скачивании
        indexes = [
            models.Index(fields=['special_link']),
        ]

    def __str__(self):
        return self.name

    @property
    def download_url(self):
        """
        Вспомогательное свойство для получения полного URL ссылки на скачивание.
        Замените 'download_file_by_token' на реальное имя вашего URL-маршрута.
        """
        from django.urls import reverse
        return reverse('download_file_by_token', kwargs={'token': str(self.special_link)})
