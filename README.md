# Open ONI Map Plugin

This provides very basic functionality to browse newspaper title locations on a map.

## Setup

You will need a list of latitude and longitudes for all of the cities you would like to display on the map.

Add them to `static/js/cities_list.js` in the following format:

```
var cities = [
  {
    "name": "Example City",
    "latlong": [42.10, -102.87],
    "papers": {
      "Example City Herald": "lccn431431"
    }
  },
  {
    "name": "Demoville",
    "latlong": [41.16, -95.93],
    "papers": {
      "Demoville Gazette": "lccn837131",
      "Demo Journal": "lccn121331"
    }
  }
];
```

To hitch this plugin to your project wagon, you will need to add a few lines in some files.

`onisite.plugins.map` needs to go in your `INSTALLED_APPS` list:

```
# onisite/settings_local.py

INSTALLED_APPS = (
    'django.contrib.humanize',
    'django.contrib.staticfiles',

    'onisite.plugins.map',
    'themes.default',
    'core',
)

```

And add the plugin's URLs with `url(r'^map/', include("onisite.plugins.map.urls"))` to `onisite/urls.py`:

```
# onisite/urls.py

from django.conf.urls import url, include

urlpatterns = [
  url(r'^map/', include("onisite.plugins.map.urls")),

  # keep this last or else urls from core may override custom urls
  url('', include("core.urls")),
]
```


## Customization

You can create your own settings by overriding a block in `map.html`.

```
  {% block javascript_map_settings %}
    <script>
      // map settings
      let startLat = 41.5;
      let startLong = -99.316;
      let startZoom = 7;
      let markerColor = "#000000";
    </script>
  {% endblock javascript_map_settings %}
```

### Centering Your Map on a State

By default, the map centers on Nebraska, so if you would prefer to look at a different state when you get to the page, you'll probably want to try finding a different lat / long / zoom combination.
