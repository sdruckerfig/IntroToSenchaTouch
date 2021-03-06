/*
 * File: app/view/Map.js
 *
 * This file was generated by Sencha Architect version 3.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.3.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.3.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('CitySearch.view.Map', {
    extend: 'Ext.Container',
    alias: 'widget.maps',

    requires: [
        'Ext.Toolbar',
        'Ext.SegmentedButton',
        'Ext.Button',
        'Ext.Map',
        'Ext.MessageBox'
    ],

    config: {
        lat: '',
        lng: '',
        address: '',
        title: '',
        linkId: 'launchexternalguidancelink',
        layout: {
            type: 'card',
            animation: 'flip'
        },
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                itemId: 'mapstoolbar',
                layout: {
                    type: 'hbox',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'segmentedbutton',
                        itemId: 'mapsviewcontrol',
                        items: [
                            {
                                xtype: 'button',
                                handler: function(button, event) {
                                    button.up('maps').setActiveItem(0);
                                },
                                pressed: true,
                                text: 'Map'
                            },
                            {
                                xtype: 'button',
                                handler: function(button, event) {
                                    Ext.Viewport.setMasked({ xtype: 'loadmask', indicator: true, message: 'Please Wait ...'});

                                    var top = button.up('maps');
                                    var pos = new google.maps.LatLng(top.getLat(),top.getLng());
                                    var me = top;

                                    top.getCurrentPosition(function(currentLoc) {


                                        me.currentLocation = currentLoc;

                                        var directionsService = new google.maps.DirectionsService();


                                        // kill old directions
                                        if (me.directionsRenderer)
                                        me.directionsRenderer.setMap(null);

                                        me.directionsRenderer = new google.maps.DirectionsRenderer({
                                            'map': top.down('map').getMap(),
                                            'preserveViewport':true,
                                            'draggable':false
                                        });

                                        // clear directions view

                                        document.getElementById("turnByTurnDirections").innerHTML = "";
                                        me.directionsRenderer.setPanel(document.getElementById("turnByTurnDirections"));

                                        var end = new google.maps.LatLng(top.getLat(), top.getLng());

                                        var request = {
                                            origin:currentLoc,
                                            destination:end,
                                            travelMode:me.directionsMode
                                        };

                                        directionsService.route(request, function (response, status) {
                                            if (status == google.maps.DirectionsStatus.OK) {
                                                me.directionsRenderer.setDirections(response);
                                                me.directionsResponse = response;
                                                Ext.Viewport.setMasked(false);
                                                top.setActiveItem(1);
                                            } else {
                                                Ext.Viewport.setMasked(false);
                                                Ext.Msg.alert("Error", "Could not determine directions. Please enable your GPS");
                                            }
                                        });
                                    });


                                },
                                text: 'Directions'
                            },
                            {
                                xtype: 'button',
                                handler: function(button, event) {
                                    // Ext.Viewport.setMasked({ xtype: 'loadmask', indicator: true, message: 'Please Wait ...'});

                                    var findNearest = true; // only use if lat/lng is "questionable"
                                    var top = button.up('maps');
                                    var webService = new google.maps.StreetViewService();
                                    var pos = new google.maps.LatLng(top.getLat(),top.getLng());
                                    var domObj = document.getElementById('streetview');


                                    if (!findNearest) {
                                        var panoramaOptions = {
                                            addressControl:true,
                                            // position:panoData.location.latLng,
                                            position: pos,
                                            pov:{
                                                heading:290,
                                                pitch:0,
                                                zoom:1
                                            }
                                        };
                                        var myPano = new google.maps.StreetViewPanorama(domObj, panoramaOptions);
                                        top.setActiveItem(2);
                                    } else {
                                        /**Check in a perimeter of 10 meters**/
                                        var checkaround = 20;

                                        webService.getPanoramaByLocation(pos, checkaround, function (panoData) {
                                            Ext.Viewport.setMasked(false);
                                            if (panoData) {
                                                if (panoData.location) {
                                                    if (panoData.location.latLng) {
                                                        var panoramaOptions = {
                                                            addressControl:true,
                                                            position:panoData.location.latLng,
                                                            pov:{
                                                                heading:290,
                                                                pitch:0,
                                                                zoom:1
                                                            }
                                                        };
                                                        var myPano = new google.maps.StreetViewPanorama(domObj, panoramaOptions);
                                                    }
                                                }
                                            } else {
                                                Ext.Msg.alert("Not Available", "Street View is not available for this location");
                                            }
                                        });
                                        top.setActiveItem(2);
                                    }
                                },
                                text: 'Street View'
                            }
                        ]
                    },
                    {
                        xtype: 'button',
                        handler: function(button, event) {
                            //Should work, needs testing on actual mobile devices
                            var top = button.up('maps');
                            var lat = top.getLat();
                            var lng = top.getLng();
                            var title = top.getTitle();
                            var mapUrl = 'http://maps.google.com/maps?z=15&t=m&q=loc:' +
                            lat + '+' + lng;

                            top.openLinkInNewWindow(mapUrl);
                        },
                        text: 'Navigate'
                    }
                ]
            },
            {
                xtype: 'map',
                itemId: 'mymap'
            },
            {
                xtype: 'container',
                html: '<div id="turnByTurnDirections"></div>',
                itemId: 'directions',
                scrollable: true
            },
            {
                xtype: 'container',
                id: 'streetview'
            }
        ],
        listeners: [
            {
                fn: 'onMyMapRender',
                event: 'maprender',
                delegate: '#mymap'
            }
        ]
    },

    onMyMapRender: function(map, gmap, eOpts) {
        var top = map.up('maps');

        var pos = new google.maps.LatLng(top.getLat(),top.getLng());

        map.setMapOptions({
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            navigationControl: true,
            navigationControlOptions: {
                style: google.maps.NavigationControlStyle.DEFAULT
            },
            center: pos
        });


        this.centerMap(map.getMap(),pos,top.getTitle(),'');

        // this shouldn't be required...and yet there's clearly
        // some sort of race condition going on...
        // so re-center after 1 second
        Ext.defer(
          function(map,lat,lng) {
            map.setMapCenter({
                latitude: lat,
                longitude: lng
            });
          },
            1000,
            this,
            [map,top.getLat(),top.getLng()]
         );

        Ext.Viewport.setMasked(false);
    },

    initialize: function() {
        this.callParent(arguments);

        this.directionsMode = google.maps.DirectionsTravelMode.DRIVING;

        Ext.Viewport.setMasked({ xtype: 'loadmask', indicator: true, message: 'Please Wait ...'});

    },

    calcDistance: function(lat1, lng1, lat2, lng2) {
         var R = 6371;
        // km
        var dLat = this.toRad((lat2 - lat1));
        var dLon = this.toRad(lng2 - lng1);
        var lat1 = this.toRad(lat1);
        var lat2 = this.toRad(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d;
    },

    toRad: function(num) {
        return num * Math.PI / 180;
    },

    centerMap: function(gMap, loc, title, desc, callback, scope) {
         if(loc != null) {
             gMap.setCenter(loc);
             this.plotLocation(gMap, loc, title, desc);
         } else {
             navigator.geolocation.getCurrentPosition(function(position) {
                 var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                 gMap.setCenter(initialLocation);
                 callback.call(scope, initialLocation);
             }, function() {
                 Ext.Msg.alert("Error", "Could not get your position.<br />Try enabling your GPS.");
             });
         }
    },

    geoCodeAddress: function(address, callback) {
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            'address' : address
        }, function(results, status) {
            if(status != google.maps.GeocoderStatus.OK) {
                Ext.Msg.alert("Address not found", status);
            } else {
                callback(results[0].geometry.location, results[0].formatted_address);
            }
        });
    },

    geoCodeAddressRet: function(address) {
          var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
            'address' : address
        }, function(results, status) {
            if(status != google.maps.GeocoderStatus.OK) {
                Ext.Msg.alert("Address not found", status);
            } else {
                return [results[0].geometry.location.lat(), results[0].geometry.location.lng()];
            }
        });
    },

    plotLocation: function(objMap, pos, title, content) {

        var marker = new google.maps.Marker({
            position : pos,
            map : objMap,
            title : title
        });

        if( typeof content == 'string' && content != '') {
            var infoWindow = new google.maps.InfoWindow({
                content : content
            });
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.open(objMap, marker);
            });
        } else if( typeof content == 'function') {

            google.maps.event.addListener(marker, 'click', content);
        }
    },

    getDirections: function(origin, destination, travelMode, callback) {
        var travelModes = [google.maps.TravelMode.DRIVING, google.maps.TravelMode.WALKING, google.maps.TravelMode.BICYCLING];

        var directionsService = new google.maps.DirectionsService();
        var request = {
            origin : origin,
            destination : destination,
            travelMode : travelModes[travelMode]
        };
        directionsService.route(request, function(response, status) {
            if(status == google.maps.DirectionsStatus.OK) {
                callback(response);
            }
        });
    },

    streetView: function(pos, domID) {
        var panoramaOptions = {
            position : pos,
            pov : {
                heading : 34,
                pitch : 10,
                zoom : 1
            }
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById(domID), panoramaOptions);
    },

    getCurrentPosition: function(callback, scope, bSurpressWarning) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                callback.call(scope, initialLocation);
            },
            function() {
                if(!bSurpressWarning) {
                    Ext.Msg.alert("Error", "Could not get your position.", function() {
                        callback.call(scope, new google.maps.LatLng(0,0));
                    });
                }
            }
        );
    },

    getCurrentAddress: function(callback, scope) {
        this.getCurrentPosition(function(latLng) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'latLng' : latLng
            }, function(results, status) {
                if(status == google.maps.GeocoderStatus.OK) {
                    callback.call(scope, results);
                }
            });
        });
    },

    addHelperLinkToBody: function() {
        if (!Ext.get(this.getLinkId())) {
            Ext.DomHelper.append(
                Ext.getBody(),
                {
                    tag: 'a',
                    style: 'display:none;',
                    id: this.getLinkId(),
                    target: '_system'

                }
            );
        }
    },

    openLinkInNewWindow: function(url) {
        this.addHelperLinkToBody();
        if (Ext.os.is.iOS && Ext.device !== undefined) {
            window.open(url, "_system"); //_system opens it in Safari
            //_self opens in the same window. On iOS, it contains a back button which android doesn't.
        } else {
            var link = Ext.getDom(this.getLinkId()),
                clickevent = document.createEvent('Event');

            link.href = url;

            clickevent.initEvent('click', true, false);
            link.dispatchEvent(clickevent);
        }
    }

});