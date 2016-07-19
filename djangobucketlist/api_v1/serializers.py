from rest_framework import serializers
from django.contrib.auth.models import User
from bucketlist.models import BucketList, BucketListItem

class UserSerializer(serializers.ModelSerializer):
    bucketlist = serializers.PrimaryKeyRelatedField(
        many=True, queryset=BucketList.objects.all())

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'bucketlist')


class BucketListSerializer(serializers.ModelSerializer):

    items = serializers.PrimaryKeyRelatedField(many=True, queryset=BucketListItem.objects.all())
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = BucketList
        fields = (
            'id', 'name', 'owner', 'date_created',
            'date_modified', 'items')


class BucketListItemSerializer(serializers.ModelSerializer):

    bucketlist = serializers.ReadOnlyField(source='bucketlist.id')

    class Meta:
        model = BucketListItem
        fields = (
            'id', 'name', 'bucketlist', 'date_created', 'date_modified', 'done'
        )
