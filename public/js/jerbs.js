(function() {
    L.mapbox.accessToken = config.key;

    // Jerbs
    var jerbs = {};
    jerbs.jobs = {};

    jerbs.addMarker = function(title, company, location, url) {
        var latlng = [];

        title = title + " at " + company;

        if (typeof location == "string") {
            map.geocoder.query(location, function(err, data) {
                if (!data) return;

                var lat = data.latlng[0];
                var lng = data.latlng[1];

                latlng = [lat, lng];

                var marker = L.marker(latlng, {
                    icon: L.mapbox.marker.icon({
                        'marker-symbol': 'suitcase',
                        'marker-color': '0044FF'
                    }),
                    title: title
                });

                marker.on('click', function(e) {
                    window.open(url);
                })

                marker.bindPopup(title);
                map.markers.addLayer(marker);
            });
        } else {
            latlng = user.position;

            var marker = L.marker(latlng, {
                icon: L.mapbox.marker.icon({
                    'marker-symbol': 'suitcase',
                    'marker-color': '0044FF'
                }),
                title: title
            });

            marker.on('click', function(e) {
                window.open(url);
            })

            marker.bindPopup(title);
            map.markers.addLayer(marker);
        }
    }

    jerbs.getData = function(term) {
        var url = 'https://jobs.github.com/positions.json';

        $.ajax({
            dataType: 'jsonp',
            url: url,
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var location = item.location;
                    var title = item.title;

                    if (location == "Anywhere") {
                        // anywhere todo
                        jerbs.addMarker(title, item.company,
                            user.position, item.url);
                    } else {
                        jerbs.addMarker(title, item.company,
                            location, item.url);
                    }
                }
                map.map.addLayer(map.markers);
            }
        });
    }

    var user = {};

    // Map
    var map = {};

    map.map = L.mapbox.map('map', 'mapbox.streets').setView([
        39.50, -98.35
    ], 4);
    map.el = document.getElementById(
        'map');
    map.markers = new L.MarkerClusterGroup();
    map.geocoder = L.mapbox.geocoder('mapbox.places');

    // Async / Events
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        user.position = [lat, lng];

        jerbs.getData();
        // map.map.setView(user.position, 10);
    });

    map.markers.on('mouseover', function(e) {
        e.layer.openPopup();
    });

    map.markers.on('mouseout', function(e) {
        e.layer.closePopup();
    });
})();
