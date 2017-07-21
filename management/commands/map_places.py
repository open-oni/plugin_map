import json
import logging
import urllib

from django.core.management.base import BaseCommand
from django.db import reset_queries

from core import models
from core.management.commands import configure_logging

configure_logging("openoni_map_places.config", "openoni_map_places.log")
_logger = logging.getLogger("map_places")
geonames_url="http://api.geonames.org/searchJSON"

class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("username", action="store",
            help="Username for the GeoNames API; set to 'demo' if you don't plan to pull any GeoNames data")
        parser.add_argument('state', action='store',
            help='State code (e.g., OR, NE, etc) for restricting the search results'),

    def handle(self, *args, **options):
        _logger.debug("Finding places in Geonames")

        # Gather up all the places' latitude and longitude data
        output_data = {}
        for place in models.Place.objects.all():
            if not place.city:
                _logger.error("A place with no city exists in your database (%s)!  " +
                    "This is probably A Bad Thing (tm)." % place.name)
                continue

            # First check for lat/lng in the database
            lat, lng = place.latitude, place.longitude

            # If we didn't have lat/lng and the username was specified, check geonames
            if lat is None and lng is None and options["username"] != "demo":
                lat, lng = _get_lat_long_from_geonames(place, options)

                # If we retrieved data, make sure we save it
                if lat is not None and lng is not None:
                    place.latitude = lat
                    place.longitude = lng
                    place.save()
                    reset_queries()

            # Record the lat/lng in our output data
            if lat is not None and lng is not None:
                output_data[place] = (lat,lng)

        _logger.info("finished looking up places in GeoNames")

        cities_json = []
        for place in output_data:
            titles = models.Title.objects.filter(places__city__iexact=place.city).all()
            if len(titles) == 0:
                continue

            city_json = {
                "name": place.city,
                "latlong": [place.latitude, place.longitude],
                "papers": {}
            }
            for title in titles:
                city_json["papers"][title.display_name] = title.lccn

            cities_json.append(city_json)

            # Populate the JSON with all the titles

        self.stdout.write("***********************")
        self.stdout.write("  Copy below:")
        self.stdout.write("***********************")
        self.stdout.write("var cities = " + json.dumps(cities_json, indent=2) + ";")
            

def _get_lat_long_from_geonames(place, options):
    url_query = {
        "name_equals":place.city,
        "maxRows":1,
        "username":options["username"],
        "adminCode1":options["state"],
        "featureClass":"P",
        "country":"US",
    }
    url = "%s?%s" % (geonames_url, urllib.urlencode(url_query))
    _logger.info("Querying %s" % url)

    h = urllib.urlopen(url)
    data = h.read()
    geodata = json.loads(data)

    if geodata is not None and "geonames" in geodata and len(geodata["geonames"]) == 1:
        return geodata["geonames"][0]["lat"], geodata["geonames"][0]["lng"]
    else:
        _logger.error("Error trying to look up %s; raw data was %s", url, data)
        return None, None
