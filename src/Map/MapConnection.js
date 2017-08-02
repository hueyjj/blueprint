class MapConnection {
    constructor() {
    }

    initEle() {
        var ele = document.createElementNS("http://www.w3.org/2000/svg", "g");
        ele.classList = "map-connectors";
    }

    create(x, y) {
    }

    change() {
    }
}

if (typeof module !== "undefined") 
    module.exports = MapConnection;
