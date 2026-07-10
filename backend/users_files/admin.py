from django.contrib import admin

from .models import UsersFiles


@admin.register(UsersFiles)
class UsersAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'name', 'size', 'upload_date', 'last_download_date', 'comment', 'special_link']

