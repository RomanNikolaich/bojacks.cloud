from django.urls import path

from .views import AddFilesView, GiveFilesView, DeleteFilesView, PatchFilesView, DownloadFileByTokenView, OpenFileByTokenView


urlpatterns = [
    path('files/post/', AddFilesView.as_view(), name='files-post'), # Получение файла с фронтенда
    path('files/get/', GiveFilesView.as_view(), name='files-get'), # Отправка файла на фронтенд
    path('files/delete/<int:pk>/', DeleteFilesView.as_view(), name='files-get'), # Удаление файла
    path('files/change/<int:pk>/', PatchFilesView.as_view(), name='files-get'), # Изменение имени и комментария файла
    path('files/download/<uuid:token>/', DownloadFileByTokenView.as_view(), name='files-download'), # Удаление файл
    path('files/open/<uuid:token>/',OpenFileByTokenView.as_view(), name='files-open'), # Открытие файла в браузере
]