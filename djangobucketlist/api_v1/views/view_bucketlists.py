from rest_framework import generics
from rest_framework.exceptions import ParseError
from rest_framework.permissions import IsAuthenticated

from api_v1.mixins import MultipleFieldLookupMixin
from api_v1.permissions import IsBucketlistOwner, IsItemOwner
from api_v1.serializers import BucketListItemSerializer, BucketListSerializer
from bucketlist.models import BucketList, BucketListItem


class BucketListView(generics.ListCreateAPIView):
    """
    Get all bucketlist, or create a new bucketlist.
    """
    serializer_class = BucketListSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        """
        Overrides the default perform_create method
        Ensure bucketlist does not exist already for user"""
        name = serializer.validated_data.get("name")
        if BucketList.objects.filter(name=name, owner=self.request.user):
            raise ParseError(detail="This bucketlist already exist")
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        """
        Overrides the default get_queryset method
        Return bucketlists belonging to a particular user only"""
        return BucketList.objects.filter(owner=self.request.user)


class BucketListDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, Update or delete a bucketlist
    """
    serializer_class = BucketListSerializer
    queryset = BucketList.objects.all()
    permission_classes = (IsAuthenticated, IsBucketlistOwner)

    def perform_update(self, serializer):
        # Ensure users does not have two bucketlist with same name

        bucketlist_id = self.kwargs.get('pk', 0)
        name = serializer.validated_data.get('name')
        bucketlist = BucketList.objects.filter(
            pk=bucketlist_id,
            owner=self.request.user).first()

        if bucketlist.name != name:
            if BucketList.objects.filter(name=name, owner=self.request.user):
                raise ParseError(detail="This bucketlist already exist")
        serializer.save()


class BucketListItemView(generics.CreateAPIView):
    """
    Create a new item.
    """
    serializer_class = BucketListItemSerializer
    permission_classes = (IsAuthenticated, IsBucketlistOwner)

    def perform_create(self, serializer):
        """
        Overrides the default perform_create method
        Ensure item does not exist already for bucketlist
        """
        bucketlist_id = self.kwargs.get('pk')
        bucketlist = BucketList.objects.filter(
            pk=bucketlist_id,
            owner=self.request.user).first()
        name = serializer.validated_data.get("name")
        if BucketListItem.objects.filter(name=name, bucketlist=bucketlist):
            raise ParseError(detail="This item already exist")
        serializer.save(bucketlist=bucketlist)


class BucketListItemDetailView(MultipleFieldLookupMixin, generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieves, Update or delete an item
    """
    serializer_class = BucketListItemSerializer
    queryset = BucketListItem.objects.all()
    permission_classes = (IsAuthenticated, IsItemOwner)
    lookup_fields = ('pk', 'bucketlist')

    def perform_update(self, serializer):
        # Ensure users does not have two bucketlist items with same name

        bucketlist_id = self.kwargs.get('bucketlist')
        item_id = self.kwargs.get('pk')
        name = serializer.validated_data.get('name')
        bucketlist = BucketList.objects.filter(
            pk=bucketlist_id,
            owner=self.request.user).first()
        item = BucketListItem.objects.filter(
            pk=item_id,
            bucketlist=bucketlist).first()

        if item.name != name:
            if BucketListItem.objects.filter(name=name, bucketlist=bucketlist):
                raise ParseError(detail="This item already exist")
        serializer.save()
