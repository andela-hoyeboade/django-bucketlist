from django.conf.urls import include, url

from api_v1 import views
from views import view_bucketlists, view_users

urlpatterns = [
    url(r'^auth/login$', view_users.LoginView.as_view(), name='apilogin'),
    url(r'^auth/register$', view_users.RegisterView.as_view(), name='apiregister'),
    url(r'^bucketlists/$', view_bucketlists.BucketListView.as_view(),
        name='bucketlist_api'),
    url(r'^bucketlists/(?P<pk>[0-9]+)$',
        view_bucketlists.BucketListDetailView.as_view(),
        name='bucketlist_detail_api'),
    url(r'^bucketlists/(?P<pk>[0-9]+)/items/$',
        view_bucketlists.BucketListItemView.as_view(),
        name='bucketlist_item_api'),
    url(r'^bucketlists/(?P<bucketlist>[0-9]+)/items/(?P<pk>[0-9]+)$',
        view_bucketlists.BucketListItemDetailView.as_view(),
        name='bucketlist_item_detail_api'),
    url(r'^docs/', include('rest_framework_swagger.urls')),

]
