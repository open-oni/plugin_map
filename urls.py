from django.urls import include, path, re_path
from onisite.plugins.map import views

urlpatterns = [
  path('', views.map, name="map_home"),
]
