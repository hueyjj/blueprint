const Draggable = require("./Draggable");

class Map extends Draggable{
    constructor() {
        super(0, 0, null, null); 
        
        this.container = document.createElement("div");
        this.container.classList       = "map-container";

        this.map = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.map.classList = "map";

        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.classList = "map-controller";
        this.group.setAttribute("transform", "matrix(1 0 0 1 0 0)");

        this.map.appendChild(this.group);
        this.container.appendChild(this.map);

        this.menu = null;
       
        this.element = this.group;

        var that = this;
        this.map.onmousedown = function (event) { 
            that.startDragging(event.clientX, event.clientY); 
            event.stopPropagation(); 
        };
        this.map.onmouseup = function (event) { 
            that.endDragging();
            event.stopPropagation(); 
        };
    }

    append(item) {
        this.group.appendChild(item.element);
    }
}

if (typeof module !== "undefined") 
    module.exports = Map;
