from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api_v1.serializers import BucketListItemSerializer, BucketListSerializer
from bucketlist.models import BucketList, BucketListItem


class BucketListView(APIView):

    """
    Get all bucketlist, or create a new bucketlist.
    """

    # Get all bucketlists
    def get(self, request):
        """
        List all bucketlists that belong to a user
        """
        bucketlist = BucketList.objects.filter(owner=self.request.user)
        serializer = BucketListSerializer(instance=bucketlist, many=True)
        return Response(serializer.data)

    # Creates a bucketlist
    def post(self, request):
        """
        Create a new bucketlist
        ---
        parameters:
            - name: name
              description: name of bucketlist to be created
              required: true
              type: string
              paramType: form
        """
        name = request.data.get('name')
        if not name:
            return Response({'message':
                             'Please provide a name.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if BucketList.objects.filter(name=name, owner=self.request.user):
            return Response({'message':
                             'Bucketlist already exist.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = BucketListSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=self.request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'message':
                         serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)


class BucketListDetailView(APIView):

    """
    Retrieve, Update or delete a bucketlist
    """

    # Checks if the bucketlist exists
    def get_object(self, bucketlist_id):
        bucketlist = BucketList.objects.filter(
            pk=bucketlist_id,
            owner=self.request.user).first()
        if bucketlist:
            return bucketlist
        else:
            raise Http404

    # Get a bucketlist
    def get(self, request, bucketlist_id):
        """
        Retrieve a bucketlist
        """
        bucketlist = self.get_object(bucketlist_id)
        serializer = BucketListSerializer(bucketlist)
        return Response(serializer.data)

    # Edit a bucketlist
    def put(self, request, bucketlist_id):
        """
        Edit a bucketlist
        ---
        parameters:
            - name: name
              description: new name for the bucketlist
              required: false
              type: string
              paramType: form
        """
        bucketlist = self.get_object(bucketlist_id)
        name = request.data.get('name')
        if not name:
            request.data['name'] = bucketlist.name

        if bucketlist.name != name:
            if BucketList.objects.filter(name=name, owner=self.request.user):
                return Response({'message':
                                 'This bucketlist already exist.'},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = BucketListSerializer(bucketlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'message':
                         serializer.errors},
                        status=status.HTTP_400_BAD_REQUEST)

    # Delete a bucketlist
    def delete(self, request, bucketlist_id):
        """
        Delete a bucketlist
        """
        bucketlist = self.get_object(bucketlist_id)
        bucketlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BucketListItemView(APIView):
    """
    Create a bucketlist item
    """

    # Checks if the bucketlist exists using the bucketlist id provided
    def get_object(self, bucketlist_id):
        bucketlist = BucketList.objects.filter(
            pk=bucketlist_id,
            owner=self.request.user).first()
        if bucketlist:
            return bucketlist
        else:
            raise Http404

    # adds a new bucketitem
    def post(self, request, bucketlist_id):
        """
        Create a new bucketlist item
        ---
        parameters:
            - name: name
              description: name of the bucketlist item to be created
              required: true
              type: string
              paramType: form

            - done: done
              description: the status of the bucketlist item
              required: false
              type: boolean
              paramType: form
        """
        bucketlist = self.get_object(bucketlist_id)
        name = request.data.get('name')
        if not name:
            return Response({'message':
                             'Please provide a name for your item.'},
                            status=status.HTTP_400_BAD_REQUEST)

        if BucketListItem.objects.filter(name=name, bucketlist=bucketlist):
            return Response({'message':
                             'This item already exist.'},
                            status=status.HTTP_400_BAD_REQUEST)

        serializer = BucketListItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(bucketlist=bucketlist)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BucketListItemDetailView(APIView):

    """
    Retrieve, Update or delete a bucketlist item
    """

    # Checks if item exists
    def get_object(self, bucketlist_id, item_id):
        bucketlist = BucketList.objects.filter(
            pk=bucketlist_id,
            owner=self.request.user).first()
        bucketlist_item = BucketListItem.objects.filter(
            pk=item_id, bucketlist_id=bucketlist_id).first()
        if bucketlist and bucketlist_item:
            return bucketlist_item
        else:
            raise Http404

    # Edit an item in a bucketlist
    def put(self, request, bucketlist_id, item_id):
        """
        Update  a bucketlist item
        ---
        parameters:
            - name: name
              description: new name for bucketlist item
              required: false
              type: string
              paramType: form

            - done: done
              description: status of the bucketlist item
              required: false
              type: boolean
              paramType: form
        """
        bucketlist_item = self.get_object(bucketlist_id, item_id)
        name = request.data.get('name')
        done = request.data.get('done')

        request.data['name'] = bucketlist_item.name if not name else name
        request.data['done'] == True if str(done).lower() == "true" else False

        if bucketlist_item.name != name:
            if BucketListItem.objects.filter(name=name,
                                             bucketlist=bucketlist_item.bucketlist):
                return Response({'message':
                                 'This item already exist.'},
                                status=status.HTTP_400_BAD_REQUEST)

        serializer = BucketListItemSerializer(
            bucketlist_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Delete an item from a buckeltist
    def delete(self, request, bucketlist_id, item_id):
        """
        Delete an item from a bucketlist
        """
        bucketlist_item = self.get_object(bucketlist_id, item_id)
        bucketlist_item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
