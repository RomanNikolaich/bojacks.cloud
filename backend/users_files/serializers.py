from rest_framework import serializers

from .models import UsersFiles


class AddFilesSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = UsersFiles
        fields = ('file', 'user', 'id', 'name', 'size', 'upload_date', 'last_download_date', 'comment', 'special_link')

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.save()
        return instance

class ChangeFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersFiles
        fields = ('comment', 'name')