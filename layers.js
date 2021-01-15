// -*- mode: javascript; indent-tabs-mode: nil; c-basic-offset: 8 -*-
"use strict";

// Base layers configuration
function greyscale(context) {
        var canvas = context.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var imageData = context.getImageData(0, 0, width, height);
        var data = imageData.data;
        for(i=0; i<data.length; i += 4){
                var r = data[i];
                var g = data[i + 1];
                var b = data[i + 2];
                // CIE luminance for the RGB
                var v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                // Show white color instead of black color while loading new tiles:
                if(v === 0.0)
                        v=255.0;
                data[i+0] = v; // Red
                data[i+1] = v; // Green
                data[i+2] = v; // Blue
                data[i+3] = 255; // Alpha
        }
        context.putImageData(imageData,0,0);

}
function createBaseLayers() {
        var layers = [];

        var world = [];
        var us = [];

        world.push(new ol.layer.Tile({
                source: new ol.source.OSM({
                        url: 'https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=9cb47d50d072496992a29f42e7734972'
}),
                name: 'osm',
                title: 'OpenStreetMap',
                type: 'base',


        }));
 
        var xyz1 = new ol.source.XYZ({
                url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png\n'
        })

        var xyz2 = new ol.source.XYZ({
                url: 'https://maps-cdn.salesboard.biz/styles/klokantech-3d-gl-style/{z}/{x}/{y}.png\n'
        })

        world.push(new ol.layer.Tile({
                source: xyz1,
                name: 'osm2',
                title: 'OpenStreetMap2',
                type: 'base',
        }));
        world.push(new ol.layer.Tile({
                source: xyz2,
                name: 'osm3',
                title: 'OpenStreetMap3',
                type: 'base',
        }));



        if (BingMapsAPIKey) {
                world.push(new ol.layer.Tile({
                        source: new ol.source.BingMaps({
                                key: BingMapsAPIKey,
                                imagerySet: 'Aerial'
                        }),
                        name: 'bing_aerial',
                        title: 'Bing Aerial',
                        type: 'base',
                }));
                world.push(new ol.layer.Tile({
                        source: new ol.source.BingMaps({
                                key: BingMapsAPIKey,
                                imagerySet: 'Road'
                        }),
                        name: 'bing_roads',
                        title: 'Bing Roads',
                        type: 'base',
                }));
        }

        if (MapzenAPIKey) {
                world.push(createMapzenLayer());
        }

        if (ChartBundleLayers) {
                var chartbundleTypes = {
                        sec: "Sectional Charts",
                        tac: "Terminal Area Charts",
                        hel: "Helicopter Charts",
                        enrl: "IFR Enroute Low Charts",
                        enra: "IFR Area Charts",
                        enrh: "IFR Enroute High Charts"
                };

                for (var type in chartbundleTypes) {
                        us.push(new ol.layer.Tile({
                                source: new ol.source.TileWMS({
                                        url: 'http://wms.chartbundle.com/wms',
                                        params: {LAYERS: type},
                                        projection: 'EPSG:3857',
                                        attributions: 'Tiles courtesy of <a href="http://www.chartbundle.com/">ChartBundle</a>'
                                }),
                                name: 'chartbundle_' + type,
                                title: chartbundleTypes[type],
                                type: 'base',
                                group: 'chartbundle'}));
                }
        }

        var nexrad = new ol.layer.Tile({
                name: 'nexrad',
                title: 'NEXRAD',
                type: 'overlay',
                opacity: 0.5,
                visible: false
        });
        us.push(nexrad);

        var refreshNexrad = function() {
                // re-build the source to force a refresh of the nexrad tiles
                var now = new Date().getTime();
                nexrad.setSource(new ol.source.XYZ({
                        url : 'http://mesonet{1-3}.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png?_=' + now,
                        attributions: 'NEXRAD courtesy of <a href="http://mesonet.agron.iastate.edu/">IEM</a>'
                }));
        };

        refreshNexrad();
        window.setInterval(refreshNexrad, 5 * 60000);

        if (world.length > 0) {
                layers.push(new ol.layer.Group({
                        name: 'world',
                        title: 'Worldwide',
                        layers: world
                }));
        }

        if (us.length > 0) {
                layers.push(new ol.layer.Group({
                        name: 'us',
                        title: 'US',
                        layers: us
                }));
        }

        return layers;
}

function createMapzenLayer() {
        // draw earth with a fat stroke;
        // force water above earth

        var earthStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                        color: '#a06000'
                }),
                stroke: new ol.style.Stroke({
                        color: '#a06000',
                        width: 5.0
                }),
                zIndex: 0
        });

        var waterStyle = new ol.style.Style({
                fill: new ol.style.Fill({
                        color: '#0040a0'
                }),
                stroke: new ol.style.Stroke({
                        color: '#0040a0',
                        width: 1.0
                }),
                zIndex: 1
        });

        var boundaryStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                        color: '#804000',
                        width: 2.0
                }),
                zIndex: 2
        });

        var dashedBoundaryStyle = new ol.style.Style({
                stroke: new ol.style.Stroke({
                        color: '#804000',
                        width: 1.0,
                        lineDash: [4, 4],
                }),
                zIndex: 2
        });

        var styleMap = {
                earth: earthStyle,

                water: waterStyle,
                basin: waterStyle,
                dock: waterStyle,
                lake: waterStyle,
                ocean: waterStyle,
                riverbank: waterStyle,
                river: waterStyle,

                country: boundaryStyle,
                disputed: dashedBoundaryStyle,
                indefinite: dashedBoundaryStyle,
                indeterminate: dashedBoundaryStyle,
                line_of_control: dashedBoundaryStyle
        };

        return new ol.layer.VectorTile({
                name: 'mapzen_vector',
                title: 'Mapzen coastlines and water',
                type: 'base',
                renderMode: 'image',
                renderOrder: function(a,b) {
                        return a.get('sort_key') - b.get('sort_key');
                },
                source: new ol.source.VectorTile({
                        url: '//vector.mapzen.com/osm/earth,water,boundaries/{z}/{x}/{y}.topojson?api_key=' + MapzenAPIKey,
                        format: new ol.format.TopoJSON(),
                        attributions: [
                                new ol.Attribution({
                                        html: 'Tiles courtesy of <a href="http://mapzen.com">Mapzen</a>'
                                }),
                                new ol.Attribution({
                                        html: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                })
                        ],

                        tileGrid: ol.tilegrid.createXYZ({
                                preload: 3,
                                maxZoom: 14,
                                tileSize: [512, 512]
                        }),

                        wrapX: true
                }),

                style: function (feature) {
                        return (styleMap[feature.get('kind')]);
                }
        });
}
