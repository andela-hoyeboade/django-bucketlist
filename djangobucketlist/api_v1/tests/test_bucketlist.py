from django.core.urlresolvers import reverse
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.test import APITestCase
import json

bucketlist_url = reverse('bucketlist_api')

class BucketListTest(APITestCase):
    def test_get_bucketlist_without_authentication(self):
        """
        Ensure a user can create a new bucketlist
        """
        response = self.client.get(bucketlist_url)
        self.assertEqual(response.status_code, 401)
