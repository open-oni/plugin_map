from django.conf.urls import url, include
from onisite.plugins.map import views

urlpatterns = [
  url('', views.map, name="map_home"),
]
