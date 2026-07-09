from django.db import models
from django.contrib.auth.models import AbstractUser
from pathlib import Path
from django.conf import settings


class Users(AbstractUser):
    # Переопределяем email, чтобы сделать его обязательным и уникальным
    email = models.EmailField(
        verbose_name='Почта',
        max_length=254,
        unique=True,
        blank=False,
        null=False
    )
    
    storage_path = models.CharField(
        max_length=255, 
        verbose_name="Относительный путь к хранилищу",
        blank=True, 
        null=True
    )

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"
    
    @property
    def full_name(self):
        """Возвращает полное имя пользователя"""
        full_name = f"{self.first_name} {self.last_name}".strip()
        return full_name if full_name else self.username

    @property
    def full_storage_path(self):
        if not self.storage_path:
            return None
        return str(Path(settings.MEDIA_ROOT) / self.storage_path)
    