const Draggable = require("./Draggable.js");

class MapItem extends Draggable {
    constructor(x, y, shape, group) {
        super(x, y, null, group);

        this.element = this.initEle(shape, x, y);

        var that = this;
        that.element.onmousedown = function (event) { 
            that.startDragging(event.clientX, event.clientY); 
            event.stopPropagation(); 
        };
        that.element.onmouseup = function (event) { 
            that.endDragging(); 
            event.stopPropagation(); 
        };

        //TODO end dragging for all elements with one event listener later 
        //should have some sort of data structure to reference all the map items
        //temporary
        document.addEventListener("mouseleave", () => { that.endDragging(); });
    }

    // Returns polygon, circle, rectangle element
    initEle(sh, x, y) {
        var ele = null; //groups shape and bg
        var shape = null;
        var bg = null;
        
        if (Shape.CIRCLE == sh) {
            ele = document.createElementNS("http://www.w3.org/2000/svg", "g");
            ele.classList = "map-item";
            shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            shape.classList = "circle";
            shape.setAttribute("cx", x);
            shape.setAttribute("cy", y);
            shape.setAttribute("r", 5);
            bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bg.classList = "circle-background";
            bg.setAttribute("cx", x);
            bg.setAttribute("cy", y);
            bg.setAttribute("r", 10);
        }
        else if (Shape.TRIANGLE == sh) {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            //TODO implement this
        }
        else if (Shape.SQUARE == sh) {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            shape.setAttribute("x", x);
            shape.setAttribute("y", y);
            shape.setAttribute("width", 5);
            shape.setAttribute("height", 5);
        }
        else if (Shape.PENTAGON == sh) {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            //TODO implement this
        }
        else {
            console.error("[error] no shape for " + sh);
            return;
        }

        if (ele && shape && bg) {
            ele.setAttribute("transform", `matrix(1 0 0 1 0 0)`);
            ele.appendChild(bg);
            ele.appendChild(shape);
        }
        else {
            ele = null;
            console.error("[error] unable to create element for " + sh + " at " + x + ", " + y);
        }

        return ele;
    }
}

const Shape = {
    CIRCLE:         "CIRCLE",
    TRIANGLE:       "TRIANGLE",
    SQUARE:         "SQUARE",
    PENTAGON:       "PENTAGON",
}

if (typeof module !== "undefined") {
    module.exports = {
        MapItem,
        Shape,
    };
}
