from django.shortcuts import render
from django.template import RequestContext

from core.models import Place

def map(request):
    places = Place.objects.all().order_by("city")

    page_title = "Newspapers by City"
    return render(request, 'map.html', locals())
