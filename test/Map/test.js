const Map = require("../../src/Map/Map.js");
const { MapItem } = require("../../src/Map/MapItem.js");
const { Shape } = require("../../src/Map/MapItem.js");

document.addEventListener("DOMContentLoaded", function () {
    var map = new Map();
    var item1 = new MapItem(100, 100, Shape.CIRCLE, map.group);
    var item2 = new MapItem(100, 200, Shape.CIRCLE, map.group);
    var item3 = new MapItem(0, 0, Shape.CIRCLE, map.group);
    map.append(item1);
    map.append(item2);
    map.append(item3);
    document.body.appendChild(map.container);
});
