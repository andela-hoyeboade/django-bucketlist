from django.contrib.auth.models import User
from rest_framework import serializers

from bucketlist.models import BucketList, BucketListItem


class UserSerializer(serializers.ModelSerializer):
    bucketlist = serializers.PrimaryKeyRelatedField(
        many=True, queryset=BucketList.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'bucketlist')


class BucketListItemSerializer(serializers.ModelSerializer):

    bucketlist = serializers.ReadOnlyField(source='bucketlist.id')

    class Meta:
        model = BucketListItem
        fields = (
            'id', 'name', 'bucketlist', 'date_created', 'date_modified', 'done'
        )


class BucketListSerializer(serializers.ModelSerializer):

    items = BucketListItemSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = BucketList
        fields = (
            'id', 'name', 'owner', 'date_created',
            'date_modified', 'items')
