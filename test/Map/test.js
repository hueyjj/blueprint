const Map = require("../../src/Map/Map.js");
const { MapItem } = require("../../src/Map/MapItem.js");
const { Shape, TagDirection } = require("../../src/Map/MapItem.js");

document.addEventListener("DOMContentLoaded", function () {
    var map = new Map();
    document.body.appendChild(map.container);
    
    var item1 = new MapItem("C++", 100, 100, Shape.CIRCLE, TagDirection.TOP, 
                            map.group, map);
    var item2 = new MapItem("Algorithms", 100, 200, Shape.CIRCLE, TagDirection.RIGHT, 
                            map.group, map);
    var item3 = new MapItem("Libraries and \n Magic", 0, 0, Shape.CIRCLE, TagDirection.LEFT, 
                            map.group, map);
    var item4 = new MapItem("Videos", 300, 150, Shape.CIRCLE, TagDirection.TOP, 
                            map.group, map);
    var item5 = new MapItem("Documentations", 500, 50, Shape.CIRCLE, TagDirection.BOTTOM,
                            map.group, map);
    map.append(item1);
    map.append(item2);
    map.append(item3);
    map.append(item4);
    map.append(item5);
    item1.runConfig();
    item2.runConfig();
    item3.runConfig();
    item4.runConfig();
    item5.runConfig();
    map.connect(item1, item2);
    map.connect(item1, item3);
    map.connect(item1, item4);
    map.connect(item1, item5);
});
