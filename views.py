from django.shortcuts import render_to_response
from django.template import RequestContext

from core.models import Place

def map(request):
    places = Place.objects.all()

    page_title = "Newspapers by City"
    return render_to_response('map.html', 
                            dictionary=locals(), 
                            context_instance=RequestContext(request))
