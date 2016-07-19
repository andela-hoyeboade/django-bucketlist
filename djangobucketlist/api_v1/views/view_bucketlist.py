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
