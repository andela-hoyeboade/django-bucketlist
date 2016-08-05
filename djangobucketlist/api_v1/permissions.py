from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """
    Permission only allow owners of object access to it
    """

    def has_object_permission(self, request, view, obj):
        # only owners of object are allowed access
        return obj.owner == request.user
