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
        //this.group.setAttribute("transform", "matrix(1 0 0 1 0 0)");
        this.group.setAttribute("transform", "translate(0,0) scale(1,1)");
        
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
        this.map.onmousedown = (function (event) { 
            this.startDragging(event.clientX, event.clientY); 
            event.stopPropagation(); 
        }).bind(this);
        this.map.onmouseup = (function (event) { 
            this.endDragging();
            event.stopPropagation(); 
        }).bind(this);
    
        //Scroll wheel zoom
        this.container.addEventListener("wheel", (function (event) {
            let scale = 0.1, MIN_SZ = 0.10;
            let matrix = this.matrix(this.group)
            let scaleX, scaleY;
            if (event.deltaY > 0) 
            {
                //Zoom out
                if (matrix[2] - scale > MIN_SZ) // stop before inversion (neg. scale)
                    scaleX = scaleY = matrix[2] - scale; 
                else 
                    scaleX = scaleY = MIN_SZ;
            }
            else
            {
                //Zoom in
                scaleX = scaleY = matrix[2] + scale;
            }
            let matrixValue = `translate(${matrix[0]},${matrix[1]}) scale(${scaleX},${scaleY})`;
            this.group.setAttribute("transform", matrixValue); 
            event.preventDefault();
        }).bind(this));
    }

    append(item) {
        var map = this;
        map.items.push(item);

        var clearQueue = () => {
            for (let i = 0; i < map.items.length; ++i)
                map.items[i].connecting = false;
            map.connectQueue = [];
        }
        item.element.addEventListener("keydown", function (event) {
            switch (event.key) {
                case "Control":
                    if (item.pressed && !item.connecting) { //CTRL + Click: Add item for connection
                        item.pressed = false;
                        item.connecting = true;
                        
                        map.connectQueue.push(item);

                        //Try and consume when there's at least two map items in queue
                        if (map.connectQueue.length > 1) {
                            let fromItem = map.connectQueue.shift();
                            let toItem = map.connectQueue.shift();
                            map.connect(fromItem, toItem);
                            map.connectQueue.push(toItem);
                            
                            clearQueue();
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
                    clearQueue();
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
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.classList = "map-item-path";
        path.setAttribute("tabindex", 0);
        path.setAttribute("d", "m 0,0 l 0,0");
        path.addEventListener("mousedown", function (event) {
            path.pressed = true;
            path.setAttribute("style", "outline: none;");
        });
        path.addEventListener("mouseup", function (event) {
            path.pressed = false;
            path.setAttribute("style", "");
        });
        path.addEventListener("keydown", (function (event) {
            switch (event.key) {
                case "Control":
                    if (path.pressed) { //CTRL + Click: Remove path from both items
                        path.pressed = false;
                        
                        fromItem.removeConnection(toItem.id);
                        toItem.removeConnection(fromItem.id);
                        //console.log("removing item id (%d) from item (%d)", toItem.id[0], fromItem.id[0]);
                        //console.log("removing item id (%d) from item (%d)", fromItem.id[0], toItem.id[0]);
                        this.connectors.removeChild(path);
                    }
                    break;
                default:
                    return;
            }
        }).bind(this));

        //console.log("connecting from Item (%d) to Item (%d)", fromItem.id[0], toItem.id[0]);
        let link1 = fromItem.addConnection({ 
                path, 
                id: toItem.id, 
                origX: toItem.initX,
                origY: toItem.initY,
                getTranslatedValue: () => { return toItem.getTranslate(toItem.element); },
                type: ConnectionType.START,
            });
        let link2 = toItem.addConnection({
                path, 
                id: fromItem.id, 
                origX: fromItem.initX,
                origY: fromItem.initY,
                type: ConnectionType.END
            }); 
        
        if (!(link1 && link2)) 
            return;
        
        //Hack? or keep perm to draw path connection
        fromItem.translate(fromItem.x, fromItem.y);
        toItem.translate(toItem.x, toItem.y);

        this.connectors.appendChild(path);
    }
}

if (typeof module !== "undefined") 
    module.exports = Map;
