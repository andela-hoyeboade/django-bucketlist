from django.conf import settings
from django.conf.urls import url
from account import views
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^dashboard$', views.dashboard, name='dashboard'),
    url(r'^logout$', 'django.contrib.auth.views.logout', {'next_page': '/'}),
]
