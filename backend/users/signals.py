import os
import shutil
import logging
from django.db.models.signals import pre_delete
from django.dispatch import receiver
from django.conf import settings
from django.contrib.auth import get_user_model  # ← вот это

logger = logging.getLogger(__name__)

# Получаем модель пользователя динамически
User = get_user_model()


@receiver(pre_delete, sender=User)
def delete_user_storage(sender, instance, **kwargs):
    """
    Сигнал, который удаляет папку пользователя с диска
    при удалении объекта User из БД.
    """
    # instance — это удаляемый объект User
    storage_path = getattr(instance, 'storage_path', None)
    
    if not storage_path:
        logger.info(f"У пользователя {instance.username} нет storage_path, пропускаем")
        return
    
    # Формируем полный путь к папке
    full_path = os.path.join(settings.MEDIA_ROOT, storage_path)
    
    # Если папки нет — ничего не делаем
    if not os.path.exists(full_path):
        logger.info(f"Папка пользователя не найдена: {full_path}")
        return
    
    try:
        # Удаляем папку рекурсивно (со всеми файлами внутри)
        shutil.rmtree(full_path)
        logger.info(f"✅ Удалена папка пользователя: {full_path}")
    except OSError as e:
        logger.error(f"❌ Ошибка при удалении папки {full_path}: {e}")
        