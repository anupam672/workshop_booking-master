from django.urls import re_path

from cms import views

app_name = "cms"

urlpatterns = [
    re_path('^$', views.home, name='home'),
    re_path('^(?P<permalink>.+)$', views.home, name='home')
]