const { Draggable, ConnectionType } = require("./Draggable.js");

class Map extends Draggable{
    constructor() {
        super(0, 0, null, null); 
        
        this.container = document.createElement("div");
        this.container.classList       = "map-container";

        this.map = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.map.classList = "map";
        this.map.setAttribute("tabindex", 0);

        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.classList = "map-controller";
        this.group.setAttribute("transform", "matrix(1 0 0 1 0 0)");
        
        this.connectors = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.connectors.classList = "map-connectors";

        this.group.appendChild(this.connectors);
        this.map.appendChild(this.group);
        this.container.appendChild(this.map);

        this.menu = null;
       
        this.element = this.group; //super class

        this.connectQueue = [];
        this.items = [];

        //Dragging
        var that = this;
        this.map.onmousedown = function (event) { 
            that.startDragging(event.clientX, event.clientY); 
            event.stopPropagation(); 
        };
        this.map.onmouseup = function (event) { 
            that.endDragging();
            //that.connectors.setAttribute("transform", `translate(-${that.dx}, -${that.dy})`);
            event.stopPropagation(); 
        };
    }

    append(item) {
        var map = this;
        map.items.push(item);

        item.element.addEventListener("keydown", function (event) {
            switch (event.key) {
                case "Control":
                    if (item.pressed && !item.connecting) {
                        item.pressed = false;
                        item.connecting = true;
                        
                        map.connectQueue.push(item);

                        //Try and consume when there's at least two map items in queue
                        if (map.connectQueue.length > 1) {
                            let fromItem = map.connectQueue.shift();
                            let toItem = map.connectQueue.shift();
                            map.connect(fromItem, toItem);
                            map.connectQueue.push(toItem);
                        }
                    }
                    break;
                default:
                    return;
            }
        });
        item.element.addEventListener("keyup", function (event) {
            //Clear queue here
            switch (event.key) {
                case "Control":
                    for (let i = 0; i < map.items.length; ++i)
                        map.items[i].connecting = false;
                    map.connectQueue = [];
                    break;
                default:
                    return;
            }
        });
        item.element.addEventListener("mousedown", function (event) {
            item.pressed = true;
        });
        item.element.addEventListener("mouseup", function (event) {
            item.pressed = false;
        });
        
        map.group.appendChild(item.element);
    }

    connect(fromItem, toItem) {
        fromItem.connectionType = ConnectionType.START;
        toItem.connectionType = ConnectionType.END;

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M 0,0 L 0,0");
        path.setAttribute("stroke", "red");

        fromItem.connection = toItem.connection = path;

        //Hack? or keep perm to draw path connection
        fromItem.translate(fromItem.x, fromItem.y);
        toItem.translate(toItem.x, toItem.y);

        this.connectors.appendChild(path);
    }
}

if (typeof module !== "undefined") 
    module.exports = Map;
