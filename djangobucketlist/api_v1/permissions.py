from django.shortcuts import get_object_or_404
from rest_framework import permissions

from bucketlist.models import BucketList, BucketListItem


class IsOwner(permissions.BasePermission):
    """
    Permission only allow owners of object access to it
    """

    def has_object_permission(self, request, view, obj):
        # only owners of object are allowed access
        return obj.owner == request.user


class IsBucketlistOwner(permissions.BasePermission):
    """
    Permission only allow owners of bucketlist access to it
    """

    def has_permission(self, request, view):
        # only owners of object are allowed access
        bucketlist = get_object_or_404(BucketList, id=view.kwargs.get('pk'))
        return bucketlist.owner == request.user

    def has_object_permission(self, request, view, obj):
        # only owners of object are allowed access
        return obj.bucketlist.owner == request.user
