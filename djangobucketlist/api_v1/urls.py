from django.conf.urls import url
from api_v1 import views
from views import view_users, view_bucketlist

urlpatterns = [
    url(r'^auth/login$', view_users.LoginView.as_view(), name='apilogin'),
    url(r'^auth/register$', view_users.RegisterView.as_view(), name='apiregister'),
    #url(r'^bucketlists/$', views.BucketListView.as_view(),
    #    name='bucket_list_api'),
    #url(r'^bucketlists/(?P<bucket_list_id>[0-9]+)$',
    #    views.BucketListDetailView.as_view(),
    #    name='bucket_list_api_detail'),
    #url(r'^bucketlists/(?P<bucket_list_id>[0-9]+)/items/$',
    #    views.BucketListItemView.as_view(),
    #    name='bucket_list_item_api'),
    #url(r'^bucketlists/(?P<bucket_list_id>[0-9]+)/items/(?P<bucket_list_item_id>[0-9]+)$',
    #    views.BucketListItemDetailView.as_view(),
    #    name='bucket_list_item_api_detail')
]