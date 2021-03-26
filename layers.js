// -*- mode: javascript; indent-tabs-mode: nil; c-basic-offset: 8 -*-
"use strict";

// Base layers configuration

function createBaseLayers() {
    var layers = [];

    var world = [];
    var us = [];
    var europe = [];

    var layer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        name: 'osm',
        title: 'OpenStreetMap',
        type: 'base',
    });

    var enhance = new ol.filter.Colorize({ operation: 'luminosity', value: 0.42 });

    layer.addFilter(enhance);
    world.push(layer)

    world.push(new ol.layer.Tile({
        source: new ol.source.OSM({
            "url": "https://{a-z}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
            "attributions": 'Courtesy of <a href="https://carto.com">CARTO.com</a>' +
                ' using data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
        }),
        name: 'carto_dark_all',
        title: 'CARTO.com Dark',
        type: 'base',
    }));


    if (world.length > 0) {
        layers.push(new ol.layer.Group({
            name: 'world',
            title: 'Worldwide',
            layers: world
        }));
    }


    return layers;
}