import React, {Component} from 'react';
import LocationList from './LocationList';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'alllocations': [
                {
                    'name': "Intelligentsia Coffee",
                    'type': "coffee shop",
                    'latitude': 40.745976,
                    'longitude': -74.005046,
                    'foursquareId': '519a94e3498e722d3d9ae1bf'
                },
                {
                    'name': "Ground Central Coffee Company",
                    'type': "coffee shop",
                    'latitude': 40.757429,
                    'longitude': -73.970380,
                    'foursquareId': '59c2a30dacb00b15be0dc0ad'
                },
                {
                    'name': "Blue Bottle Coffee",
                    'type': "coffee shop",
                    'latitude': 40.710746,
                    'longitude': -74.012135,
                    'foursquareId': '59bd506ce2d4aa3d68b99a88'
                },
                {
                    'name': "Little Collins",
                    'type': "coffee shopr",
                    'latitude': 40.759907,
                    'longitude': -73.969643,
                    'foursquareId': '51c9b6e1498e263056040a69'
                },
                {
                    'name': "Black Fox Coffee Co.",
                    'type': "coffee shop",
                    'latitude': 40.706469,
                    'longitude': -74.007738,
                    'foursquareId': '574456e5498e39c73d234da1'
                },
                {
                    'name': "Bluestone Lane",
                    'type': "coffee shop",
                    'latitude': 40.7522916,
                    'longitude': -73.99880630000001,
                    'foursquareId': '59ca57dd3d47910ad148e668'
                }
            ],
            'map': '',
            'infowindow': '',
            'prevmarker': ''
        };

        this.initMap = this.initMap.bind(this);
        this.openInfoWindow = this.openInfoWindow.bind(this);
        this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }

    componentDidMount() {
        window.initMap = this.initMap;
        loadMapJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCPi0o_tjNjKYYDe_6nYg82r0leI7kKlOE&callback=initMap')
    }

    initMap() {
        var self = this;

        var mapview = document.getElementById('map');

        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: {lat: 40.7713024, lng: -73.9632393},
            zoom: 12,
            styles: self.styleMap(),
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, 'closeclick', function () {
            self.closeInfoWindow();
        });

        this.setState({
            'map': map,
            'infowindow': InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function () {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, 'click', function () {
            self.closeInfoWindow();
        });

        var alllocations = [];
        this.state.alllocations.forEach(function (location) {
            var longname = location.name + ' / ' + location.type;
            var marker = new window.google.maps.Marker({
                position: new window.google.maps.LatLng(location.latitude, location.longitude),
                animation: window.google.maps.Animation.DROP,
                map: map
            });

            marker.addListener('click', function () {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            alllocations.push(location);
        });
        this.setState({
            'alllocations': alllocations
        });
    }

    styleMap(){
      var styles = [
        {
          featureType: 'water',
          stylers: [
            { color: '#19a0d8' }
          ]
        },{
          featureType: 'administrative',
          elementType: 'labels.text.stroke',
          stylers: [
            { color: '#ffffff' },
            { weight: 6 }
          ]
        },{
          featureType: 'administrative',
          elementType: 'labels.text.fill',
          stylers: [
            { color: '#e85113' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [
            { color: '#efe9e4' },
            { lightness: -40 }
          ]
        },{
          featureType: 'transit.station',
          stylers: [
            { weight: 9 },
            { hue: '#e85113' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'labels.icon',
          stylers: [
            { visibility: 'off' }
          ]
        },{
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [
            { lightness: 100 }
          ]
        },{
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [
            { lightness: -100 }
          ]
        },{
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [
            { visibility: 'on' },
            { color: '#f0e4d3' }
          ]
        },{
          featureType: 'road.highway',
          elementType: 'geometry.fill',
          stylers: [
            { color: '#efe9e4' },
            { lightness: -25 }
          ]
        }
      ];

      return styles;
    }

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'prevmarker': marker
        });
        this.state.infowindow.setContent('Loading ...');
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }

    getMarkerInfo(marker) {
        var self = this;
        var clientId = "KBATY0CX4W1KO0RDAXC1Y435MJM1TEZLHLEIXDGV5WTVLZO4";
        var clientSecret = "SXMO4L4JA4BCB02VR0USSCOR51ZGDNZDWBYLJ35G4DXHKXLA";
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + marker.getPosition().lat() + "," + marker.getPosition().lng() + "&limit=1";
        fetch(url).then(function (response) {
                    if (response.status !== 200) {
                        self.state.infowindow.setContent("Sorry, there is no data loaded");
                        return;
                    }

                    // Examine the text in the response
                    response.json().then(function (data) {

                        var location_data = data.response.venues[0];
                        var title = '<h3>' + location_data["name"] + '</h3><br>';
                        var verified = '<strong>Verified Location: </strong>' + (location_data.verified ? 'Yes' : 'No') + '<br>';
                        var hasPerk = '<strong>hasPerk : </strong>' + location_data.hasPerk + '<br>';
                        var address = '<strong>Address : </strong>' + location_data.location.formattedAddress[0] + '<br>'+ location_data.location.formattedAddress[1] + '<br>'+ location_data.location.formattedAddress[2] + '<br>';
                        var readMore = '<a href="https://foursquare.com/v/'+ location_data.id +'" target="_blank">Read More => Foursquare Website</a>'
                        self.state.infowindow.setContent(title + hasPerk + address + verified + readMore);

                    });
                }
            ).catch(function (err) {
                self.state.infowindow.setContent("Sorry data can't be loaded");
            });
    }

    closeInfoWindow() {
        if (this.state.prevmarker) {
            this.state.prevmarker.setAnimation(null);
        }
        this.setState({
            'prevmarker': ''
        });
        this.state.infowindow.close();
    }

    render() {
        return (
            <div>
                <LocationList key="100" alllocations={this.state.alllocations} openInfoWindow={this.openInfoWindow}
                              closeInfoWindow={this.closeInfoWindow}/>
                <div id="map"></div>
            </div>
        );
    }
}

export default App;

function loadMapJS(src) {
    var reference = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("no maps loaded");
    };
    reference.parentNode.insertBefore(script, reference);
}
