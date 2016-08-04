from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from bucketlist.models import BucketList, BucketListItem

bucketlist_url = reverse('bucketlist_api')
new_bucketlist_data = {'name': 'Bucketlist1'}
new_bucketlist_item_data = {'name': 'Item1'}


class BucketListTest(APITestCase):

    def setUp(self):
        # Login the user and get the token
        registration_data = {'username': 'hassan', 'email': 'oyeboadehassan@gmail.com',
                             'password': 'adeola', 'confirm_password': 'adeola'}
        login_data = {'username': 'hassan', 'password': 'adeola'}
        self.client.post(reverse('apiregister'),
                         registration_data, format='multipart')
        login_response = self.client.post(reverse('apilogin'), login_data)
        self.token = 'Token ' + login_response.data.get('token')

    def create_new_bucketlist(self):
        response = self.client.post(bucketlist_url,
                                    data=new_bucketlist_data, format='multipart')
        bucketlist_id = response.data.get('id')
        self.bucketlist_detail_url = reverse('bucketlist_detail_api',
                                             kwargs={'bucketlist_id': bucketlist_id})

    def create_new_bucketlist_item(self):
        response = self.client.post(bucketlist_url, data=new_bucketlist_data,
                                    format='multipart')
        bucketlist_id = response.data.get('id')
        self.bucketlist_item_url = (reverse('bucketlist_item_api',
                                            kwargs={'bucketlist_id': bucketlist_id}))
        response = self.client.post(self.bucketlist_item_url,
                                    data=new_bucketlist_item_data, format='multipart')
        item_id = response.data.get('id')
        self.bucketlist_detail_url = reverse('bucketlist_item_detail_api',
                                             kwargs={'bucketlist_id': bucketlist_id, 'item_id': item_id})

    def test_create_bucketlist_with_valid_name(self):
        """
        Ensure users can create new bucketlist
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.post(
            bucketlist_url, data=new_bucketlist_data, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(BucketList.objects.filter(
            name=new_bucketlist_data.get('name')))

    def test_create_bucketlist_with_blank_name(self):
        """
        Ensure users cannot create new bucketlist with blank name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.post(
            bucketlist_url, data={'name': ''}, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_create_bucketlist_with_exising_name(self):
        """
        Ensure user cannot create new bucketlist with existing name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.client.post(
            bucketlist_url, data=new_bucketlist_data, format='multipart')
        response = self.client.post(
            bucketlist_url, data=new_bucketlist_data, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_create_bucketlist_with_invalid_name(self):
        """
        Ensure user cannot create new bucketlist with invalid name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.post(
            bucketlist_url, data={'name': ('Bucketlist' * 25)}, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_retrieve_all_bucketlist(self):
        """
        Ensure user can retrive his bucketlist(s)
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.client.post(
            bucketlist_url, data=new_bucketlist_data, format='multipart')
        response = self.client.get(bucketlist_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0].get(
            'name'), new_bucketlist_data['name'])

    def test_retrieve_single_bucketlist(self):
        """
        Ensure user can retrieve his bucketlist(s)
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist()
        response = self.client.get(self.bucketlist_detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('name'),
                         new_bucketlist_data['name'])

    def test_retrieve_non_existing_bucketlist(self):
        """
        Ensure user get a 404 error when accessing a non-exisitng bucketist
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.get(
            reverse('bucketlist_detail_api', kwargs={'bucketlist_id': 190}))
        self.assertEqual(response.status_code, 404)

    def test_update_bucketlist(self):
        """
        Ensure user can update their bucketlist(s)
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist()
        response = self.client.put(self.bucketlist_detail_url, data={
                                   'name': 'Bucketlist2'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('name'), 'Bucketlist2')

    def test_update_bucketlist_without_name(self):
        """
        Ensure user can update their bucketlist without specifying name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist()
        response = self.client.put(
            self.bucketlist_detail_url, data={'name': ''})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data.get('name'),
                         new_bucketlist_data['name'])

    def test_update_bucketlist_with_invalid_name(self):
        """
        Ensure user can update their bucketlist without specifying name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist()
        response = self.client.put(self.bucketlist_detail_url, data={
                                   'name': ('Bucketlist' * 25)})
        self.assertEqual(response.status_code, 400)

    def test_delete_bucketlist(self):
        """
        Ensure user can delete their bucketlist(s)
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist()
        response = self.client.delete(self.bucketlist_detail_url)
        self.assertEqual(response.status_code, 204)

    def test_create_bucketlist_item_with_valid_name(self):
        """
        Ensure users can create new bucketlist item
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.post(bucketlist_url, data=new_bucketlist_data,
                                    format='multipart')
        bucketlist_id = response.data.get('id')
        bucketlist_item_url = (reverse('bucketlist_item_api',
                                       kwargs={'bucketlist_id': bucketlist_id}))
        response = self.client.post(
            bucketlist_item_url, data=new_bucketlist_data, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertIsNotNone(BucketListItem.objects.filter(
            name=new_bucketlist_item_data['name']))

    def test_create_bucketlist_item_with_blank_name(self):
        """
        Ensure users cannot create new bucketlist item with blank name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.post(bucketlist_url, data=new_bucketlist_data,
                                    format='multipart')
        bucketlist_id = response.data.get('id')
        bucketlist_item_url = (reverse('bucketlist_item_api',
                                       kwargs={'bucketlist_id': bucketlist_id}))
        response = self.client.post(bucketlist_item_url, data={
                                    'name': ''}, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_create_bucketlist_item_with_invalid_name(self):
        """
        Ensure users cannot create new bucketlist item with invalid name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.post(bucketlist_url, data=new_bucketlist_data,
                                    format='multipart')
        bucketlist_id = response.data.get('id')
        bucketlist_item_url = (reverse('bucketlist_item_api',
                                       kwargs={'bucketlist_id': bucketlist_id}))
        response = self.client.post(bucketlist_item_url, data={
                                    'name': ('Bucketlist' * 25)}, format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_create_bucketlist_item_on_a_non_existing_bucketlist(self):
        """
        Ensure users cannot create new bucketlist item on a
        bucketist that does not exist. A 404 error should be returned
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.post(bucketlist_url, data=new_bucketlist_data,
                                    format='multipart')
        bucketlist_item_url = (reverse('bucketlist_item_api',
                                       kwargs={'bucketlist_id': 1010}))
        response = self.client.post(bucketlist_item_url, data={
                                    'name': 'Item1'}, format='multipart')
        self.assertEqual(response.status_code, 404)

    def test_create_bucketlist_item_with_exisitng_name(self):
        """
        Ensure users cannot create new bucketlist item with existing name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist_item()
        response = self.client.post(self.bucketlist_item_url,
                                    data={
                                        'name': new_bucketlist_item_data['name']},
                                    format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_update_bucketlist_item(self):
        """
        Ensure users can update a bucketlist item
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist_item()
        response = self.client.put(self.bucketlist_detail_url,
                                   data={'name': 'Item2'},
                                   format='multipart')
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(BucketListItem.objects.filter(name='Item2'))

    def test_update_bucketlist_item_with_invalid_name(self):
        """
        Ensure users cannot update a bucketlist item with an invalid name
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist_item()
        response = self.client.put(self.bucketlist_detail_url,
                                   data={'name': ('Item2' * 50)},
                                   format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_delete_bucketlist_item(self):
        """
        Ensure users can delete a bucketlist item
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        self.create_new_bucketlist_item()
        response = self.client.delete(self.bucketlist_detail_url)
        self.assertEqual(response.status_code, 204)

    def test_access_non_existing_bucketlist_item(self):
        """
        Ensure users get a 404 error when they try to
        access a non-exisitng item
        """
        # Test access without authentication
        plain_response = self.client.get(bucketlist_url)
        self.assertEqual(plain_response.status_code, 401)

        # Set authentication token in header
        self.client.credentials(HTTP_AUTHORIZATION=self.token)

        # Asserting TRUE access
        response = self.client.delete(reverse('bucketlist_item_detail_api',
                                              kwargs={'bucketlist_id': 45,
                                                      'item_id': 786}))
        self.assertEqual(response.status_code, 404)
