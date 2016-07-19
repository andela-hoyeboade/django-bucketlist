from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api_v1.serializers import BucketListSerializer, BucketListItemSerializer
from bucketlist.models import BucketList

class BucketListView(APIView):

    """
    Get all bucketlist, or create a new bucketlist.
    """

    def get(self, request):
        """
        List all bucketlists that belong to a user
        """
        bucketlist = BucketList.objects.filter(owner=self.request.user)
        serializer = BucketListSerializer(bucketlist, many=True)
        return Response(serializer.data)

    # creates a new bucket
    def post(self, request):
        """
        Create a new bucketlist
        ---
        parameters:
            - name: name
              description: name of bucket to create
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
                              serializer.errors},  status=status.HTTP_400_BAD_REQUEST)

class BucketListDetailView(APIView):

    """
    Retrieve, Update or delete a bucketlist
    """

    # checks the bucket exists in the database
    def get_object(self, bucketlist_id):
        bucketlist = BucketList.objects.filter(
            pk=bucketlist_id,
            owner=self.request.user).first()
        if bucketlist:
            return bucketlist
        else:
            raise Http404

    # Get the bucketlist
    def get(self, request, bucketlist_id):
        """
        Retrieve a bucketlist
        """
        bucketlist = self.get_object(bucketlist_id)
        serializer = BucketListSerializer(bucketlist)
        return Response(serializer.data)

    # Edit bucketlist
    def put(self, request, bucketlist_id):
        """
        Edit a bucketlist
        ---
        parameters:
            - name: name
              description: change the name of bucket
              required: true
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
                                     'Bucketlist already exist.'},
                                    status=status.HTTP_400_BAD_REQUEST)

        serializer = BucketListSerializer(bucketlist, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response({'message':
                              serializer.errors},  status=status.HTTP_400_BAD_REQUEST)

    # Delete the bucketlist
    def delete(self, request, bucketlist_id):
        """
        Delete a bucket
        """
        bucketlist = self.get_object(bucketlist_id)
        bucketlist.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
