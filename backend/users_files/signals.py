from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import UsersFiles


@receiver(post_delete, sender=UsersFiles)
def delete_file_from_storage(sender, instance, **kwargs):
    """
    Удаляет физический файл с диска при удалении записи из БД.
    """
    # instance.file — это FieldFile, у него есть метод delete()
    # который удаляет и файл с диска, и запись о нём
    if instance.file:
        # save=False — не вызывать save() модели (она уже удалена)
        instance.file.delete(save=False)
