import os
import logging

from django.utils.encoding import filepath_to_uri
import mimetypes
from urllib.parse import quote

from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import FileResponse, Http404
from django.utils import timezone
from rest_framework.exceptions import NotFound
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView

from .models import UsersFiles
from .serializers import AddFilesSerializer, ChangeFileSerializer
from .permissions import IsOwnerOrAdmin
    

logger = logging.getLogger(__name__)
    

class AddFilesView(APIView):
    """ Добавление файла """

    permission_classes = [IsAuthenticated] 

    def post(self, request):
        serializer = AddFilesSerializer(data=request.data)
        
        if serializer.is_valid():
            logger.info(f"Валидация успешна для пользователя {request.user.id}")
            file = serializer.save(user=request.user)  # ← Передаем user!
            logger.info(f"Файл загружен: {file.name} (id={file.id}, user_id={request.user.id})")

            return Response({
                'file': {
                    'id': file.id,
                    'name': file.name,
                    'size': file.size,
                    'upload_date': file.upload_date,
                    'last_download_date': file.last_download_date,
                    'comment': file.comment,
                    'special_link': file.special_link
                },
            }, status=status.HTTP_201_CREATED)
        
        # Если есть ошибки валидации, вернем их
        # Выводим детали ошибок
        logger.warning(f"Ошибка валидации при загрузке файла (user_id={request.user.id}): {serializer.errors}")
        logger.debug(f"Данные запроса: {request.data}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GiveFilesView(ListAPIView):
    """ Передача списка файлов """

    serializer_class = AddFilesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Админ может видеть все файлы или фильтровать по пользователю
        if user.is_staff or user.is_superuser:
            queryset = UsersFiles.objects.all()
            
            # Если передан параметр ?user_id=123, фильтруем по этому пользователю
            user_id = self.request.query_params.get('user_id')
            if user_id:
                queryset = queryset.filter(user_id=user_id)
            
            return queryset
        
        # Обычный пользователь видит только свои файлы
        return UsersFiles.objects.filter(user=user)


class DeleteFilesView(DestroyAPIView):
    """ Удаление файла """

    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = UsersFiles.objects.all()  # ← Возвращаем все объекты

    def perform_destroy(self, instance):
        logger.info(f"Файл удален: {instance.name} (id={instance.id}, user_id={instance.user.id})")
        super().perform_destroy(instance)
    

class PatchFilesView(UpdateAPIView):
    """ Изменение файла """

    serializer_class = ChangeFileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
    queryset = UsersFiles.objects.all()  # ← Возвращаем все объекты

    def get_serializer(self, *args, **kwargs):
        # Автоматически включаем partial=True для PATCH
        kwargs['partial'] = True
        return super().get_serializer(*args, **kwargs)
    
    def perform_update(self, serializer):
        instance = serializer.save()
        logger.info(f"Файл обновлен: {instance.name} (id={instance.id}, user_id={instance.user.id})")
    

class DownloadFileByTokenView(APIView):
    """
    Скачивание файла по специальному токену (as_attachment=True).
    Эндпоинт публичный — аутентификация происходит через токен в URL.
    """
    permission_classes = [AllowAny]        # Доступен всем
    authentication_classes = []            # Не проверяем JWT из заголовка

    def get(self, request, token):
        # 1. Ищем файл по токену
        try:
            file_obj = UsersFiles.objects.get(special_link=token)
        except UsersFiles.DoesNotExist:
            # Теперь это DRF-исключение → вернется JSON с 404
            logger.warning(f"Попытка скачать несуществующий файл (token={token})")
            raise NotFound("Файл не найден или ссылка недействительна")

        # 2. Обновляем дату последнего скачивания
        file_obj.last_download_date = timezone.now()
        file_obj.save(update_fields=['last_download_date'])
        logger.info(f"Файл скачан: {file_obj.name} (id={file_obj.id}, token={token})")

        # 3. Открываем файл и возвращаем
        try:
            response = FileResponse(
                open(file_obj.file.path, 'rb'),
                as_attachment=True,
                filename=file_obj.name
            )
            return response
        except FileNotFoundError:
            logger.error(f"Физический файл отсутствует: {file_obj.file.path} (id={file_obj.id})")
            raise NotFound("Физический файл отсутствует на сервере")


class OpenFileByTokenView(APIView):
    """
    Открытие файла в браузере (inline) по специальному токену.
    """
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, token):
        # 1. Ищем файл по токену
        try:
            file_obj = UsersFiles.objects.get(special_link=token)
        except UsersFiles.DoesNotExist:
            logger.warning(f"Попытка открыть несуществующий файл (token={token})")
            raise NotFound("Файл не найден или ссылка недействительна")

        # 2. Обновляем дату последнего скачивания
        file_obj.last_download_date = timezone.now()
        file_obj.save(update_fields=['last_download_date'])
        logger.info(f"Файл открыт в браузере: {file_obj.name} (id={file_obj.id}, token={token})")

        # 3. Открываем файл для просмотра в браузере
        try:
            # ШАГ 1: Определяем MIME-тип
            content_type, _ = mimetypes.guess_type(file_obj.name)
            if not content_type:
                content_type, _ = mimetypes.guess_type(file_obj.file.name)
            if not content_type:
                ext = os.path.splitext(file_obj.name)[1].lower()
                mime_map = {
                    '.pdf': 'application/pdf',
                    '.jpg': 'image/jpeg',
                    '.jpeg': 'image/jpeg',
                    '.png': 'image/png',
                    '.gif': 'image/gif',
                    '.webp': 'image/webp',
                    '.svg': 'image/svg+xml',
                    '.mp4': 'video/mp4',
                    '.webm': 'video/webm',
                    '.mp3': 'audio/mpeg',
                    '.wav': 'audio/wav',
                    '.txt': 'text/plain',
                    '.html': 'text/html',
                    '.css': 'text/css',
                    '.js': 'application/javascript',
                    '.jsx': 'application/javascript',
                    '.json': 'application/json',
                    '.xml': 'application/xml',
                    '.doc': 'application/msword',
                    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    '.xls': 'application/vnd.ms-excel',
                    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    '.ppt': 'application/vnd.ms-powerpoint',
                    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    '.zip': 'application/zip',
                    '.rar': 'application/x-rar-compressed',
                }
                content_type = mime_map.get(ext, 'application/octet-stream')

            # ШАГ 2: Открываем файл
            file_handle = open(file_obj.file.path, 'rb')

            # ШАГ 3: Формируем ответ (as_attachment=False = открыть в браузере)
            response = FileResponse(
                file_handle,
                content_type=content_type,
                as_attachment=False,
            )

            # ШАГ 4: Content-Disposition с поддержкой UTF-8 (RFC 5987)
            encoded_filename = quote(file_obj.name)
            response['Content-Disposition'] = (
                f'inline; filename="{encoded_filename}"; '
                f'filename*=UTF-8\'\'{encoded_filename}'
            )

            # ШАГ 5: Кэширование
            response['Cache-Control'] = 'public, max-age=3600'
            logger.debug(f"MIME-тип: {content_type}, Content-Disposition: {response['Content-Disposition']}")
            return response

        except FileNotFoundError:
            logger.error(f"Физический файл отсутствует: {file_obj.file.path} (id={file_obj.id})")
            raise NotFound("Физический файл отсутствует на сервере")