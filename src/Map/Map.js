const { Draggable, ConnectionType } = require("./Draggable.js");

class Map extends Draggable {
    constructor(path) {
        super(0, 0, null, null); 
        
        this.mouseX = null;
        this.mouseY = null;

        this.container = document.createElement("div");
        this.container.classList = "map-container";

        this.map = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.map.classList = "map";
        this.map.setAttribute("tabindex", 0);

        this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.group.classList = "map-controller";
        this.group.setAttribute("transform", "translate(0,0) scale(1,1)");
        
        this.connectors = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this.connectors.classList = "map-connectors";

        //Path
        this.mapLocationContainer = document.createElement("div");
        this.mapLocationContainer.classList = "location-container";

        this.location = document.createElement("span");
        this.location.classList = "location"
        this.location.textContent = path;

        this.mapLocationContainer.appendChild(this.location);

        this.container.appendChild(this.mapLocationContainer);
        this.container.appendChild(this.map);
        this.map.appendChild(this.group);
        this.group.appendChild(this.connectors);

        this.menu = null;
       
        this.element = this.group; //super class

        this.connectQueue = [];
        this.items = [];

        this.tagName = null;

        this.parentItem = null;

        this.map.addEventListener("mousemove", (function(event) {
            this.mouseX = event.clientX;
            this.mouseY = event.clientY;
        }).bind(this));

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
            let matrix = this.matrix(this.group);
            let scaleX, scaleY;
            if (event.deltaY > 0) {
                //Zoom out
                if (matrix[2] - scale > MIN_SZ) // stop before inversion (neg. scale)
                    scaleX = scaleY = matrix[2] - scale; 
                else 
                    scaleX = scaleY = MIN_SZ;
            }
            else {
                //Zoom in
                scaleX = scaleY = matrix[2] + scale;
            }
            let matrixValue = `translate(${matrix[0]},${matrix[1]}) scale(${scaleX},${scaleY})`;
            this.group.setAttribute("transform", matrixValue); 
            event.preventDefault();
        }).bind(this));

        this.container.addEventListener("keyup", (function (event) {
            switch (event.key) {
                case "Alt": this.toggleAllTags(); break;
                case "n": 
                    let translate = this.getTranslate(this.group);
                    let locX = this.mouseX - translate[0],
                        locY = this.mouseY - translate[1];
                    let newItem = new MapItem("Sub item 1", locX, locY, Shape.CIRCLE, TagDirection.RIGHT, 
                                               this.group, this, null);
                    this.append(newItem);
                    break;
                default: return;
            }
        }).bind(this));
    }

    append(item) {
        this.items.push(item);

        let clearQueue = (() => {
            for (let i = 0; i < this.items.length; ++i)
                this.items[i].connecting = false;
            this.connectQueue = [];
        }).bind(this);
        
        //TODO Put this in MapItem class instead, too much responsibility for Map class 
        item.element.addEventListener("keydown", (function (event) {
            switch (event.key) {
                case "Control":
                    if (!item.connecting) {
                        item.connecting = true;
                        this.connectQueue.push(item);

                        //Try and consume when there's at least two map items in queue
                        if (this.connectQueue.length > 1) {
                            let fromItem = this.connectQueue.shift();
                            let toItem = this.connectQueue.shift();
                            this.connect(fromItem, toItem);
                            this.connectQueue.push(toItem);
                            clearQueue();
                        }
                    }
                    break;
                default: return;
            }
        }).bind(this));
        item.element.addEventListener("keyup", function (event) {
            switch (event.key) {
                case "Control": clearQueue(); break;
                default: return;
            }
        });
        item.element.addEventListener("focus", function (event) { 
            //Handle focus here
        });

        this.group.appendChild(item.element);
        item.translate(item.initX, item.initY);
    }

    remove(item) {
        while (item.connections.length > 0) {
            this.connectors.removeChild(item.connections[0].path);
            item.connections[0].item.removeConnection(item.id);
            item.removeConnection(item.connections[0].id);
        }

        let index = -1;
        for (let i = 0; i < this.items.length; ++i) {
            if (item == this.items[i]) {
                index = i;
            }
        }
        this.items.splice(index, 1);
        this.group.removeChild(item.element);
    }

    connect(fromItem, toItem) {
        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.classList = "map-item-path";
        path.setAttribute("tabindex", 0);
        path.setAttribute("d", "m 0,0 l 0,0");
        path.removeConnection = (function (fromItem, toItem) {
            fromItem.removeConnection(toItem.id);
            toItem.removeConnection(fromItem.id);
            this.connectors.removeChild(path);
        }).bind(this);
        path.addEventListener("mousedown", function (event) {
            path.setAttribute("style", "outline: none;");
        });
        path.addEventListener("mouseup", function (event) {
            path.setAttribute("style", "");
        });
        path.addEventListener("keydown", function (event) {
            switch (event.key) {
                case "Control":     path.removeConnection(fromItem, toItem); break;
                case "Backspace":   path.removeConnection(fromItem, toItem); break;
                case "Delete":      path.removeConnection(fromItem, toItem); break;
                default: return;
            }
        });

        //console.log("connecting from Item (%d) to Item (%d)", fromItem.id[0], toItem.id[0]);
        let link1 = fromItem.addConnection({ 
                type: ConnectionType.START,
                path: path, 
                id: toItem.id, 
                origX: toItem.initX,
                origY: toItem.initY,
                getTranslatedValue: () => { return toItem.getTranslate(toItem.element); },
                item: toItem,
            });
        let link2 = toItem.addConnection({
                type: ConnectionType.END,
                path: path, 
                id: fromItem.id, 
                origX: fromItem.initX,
                origY: fromItem.initY,
                item: fromItem,
            }); 
        
        if (!(link1 && link2)) 
            return;
       
        //Hack? or keep perm to draw path connection
        fromItem.translate(fromItem.x, fromItem.y);
        toItem.translate(toItem.x, toItem.y);

        this.connectors.appendChild(path);
    }

    toggleAllTags() {
        for (let i = 0; i < this.items.length; ++i) {
            if (!this.items[i].tagVisible) {
                this.items[i].tagVisible = true; 
                this.items[i].showTag();
            }
            else {
                this.items[i].tagVisible = false;
                this.items[i].hideTag();
            }
        }
    }

    setPath(path) {
        this.location.textContent = path;
    }
}

if (typeof module !== "undefined") 
    module.exports = Map;

const { MapItem, Shape, TagDirection } = require("./MapItem.js"); 
