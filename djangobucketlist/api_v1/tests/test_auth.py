from django.core.urlresolvers import reverse

from rest_framework.test import APITestCase
import json

bucketlist_url = reverse('bucketlist_api')

class BucketListTest(APITestCase):
    def test_access_bucketlist_without_authentication(self):
        """
        Ensure a user cannot access a bucketlist without authentication
        """
        response = self.client.get(bucketlist_url)
        self.assertEqual(response.status_code, 401)

    
