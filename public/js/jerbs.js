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
                            user.location, item.url);
                    } else {
                        jerbs.addMarker(title, item.company,
                            location, item.url);
                    }
                }
                map.map.addLayer(map.markers);
            }
        });
    }

    // User
    var user = {};
    user.data = JSON.parse(localStorage.getItem('jerbs_data'));
    user.save = function() {
        localStorage.set('jerbs_data', user.data);
    }

    // Map
    var map = {};

    map.map = L.mapbox.map('map', 'mapbox.streets');
    map.el = document.getElementById(
        'map');
    map.markers = new L.MarkerClusterGroup();
    map.geocoder = L.mapbox.geocoder('mapbox.places');

    // Async / Events
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        user.position = [lat, lng];



        // map.map.setView(user.position, 10);
    });

    map.markers.on('mouseover', function(e) {
        e.layer.openPopup();
    });

    map.markers.on('mouseout', function(e) {
        e.layer.closePopup();
    });

    // onload
    window.onload = function() {
        // handle user.data
        if (user.data == null) {
            // jerbs_data needs to be created
            user.data = {};
            localStorage.setItem('jerbs_data', JSON.stringify(user.data));
            // console.log("jerbs_data was created");
        } else {
            // jerbs_data exists already

            // console.log("jerbs_data exists");
        }

        jerbs.getData('web developer');
    }
})();
