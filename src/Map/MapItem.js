const Shape = {
    CIRCLE:         "CIRCLE",
    TRIANGLE:       "TRIANGLE",
    SQUARE:         "SQUARE",
    PENTAGON:       "PENTAGON",
}

class MapItem {
    
    constructor(shape, x, y, group) {
        this.x = x;
        this.y = y;
        this.group = group;
        //this.dragging = false;

        this.element = this.initEle(shape, x, y); //reference to element

        var that = this;
        that.element.onmousedown = function (event) { that.startDragging(); event.stopPropagation(); };
        that.element.onmouseup = function (event) { that.endDragging(); event.stopPropagation(); };

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

    startDragging() {
        //this.dragging = true;
        var that = this;
        document.body.onmousemove = function (e) {
            that.translatePos(e.clientX, e.clientY);
        };
    }

    endDragging() {
        //this.dragging = false;
        document.body.onmousemove = null;
    }

    translatePos(destX, destY) {
        let dx = destX - this.x,
            dy = destY - this.y;

        let originalPos = this.getMatrix(this.element),
            zoom = this.getMatrix(this.group);

        // Scale down/up translation distance for zoom
        if (this.element == this.parent) {
            dx += originalPos[4]; 
            dy += originalPos[5];
        }
        else {
            dx = originalPos[4] + (dx / zoom[0]); //zoom scale factor
            dy = originalPos[5] + (dy / zoom[3]);
        }

        let matrixValue = `matrix(${originalPos[0]} ${originalPos[1]} ${originalPos[2]} ${originalPos[3]} ${dx} ${dy})`;

        this.x = destX;
        this.y = destY;
        this.element.setAttribute("transform", matrixValue); 
    }

    getMatrix(e) {
        let matrix = e.getAttribute("transform").slice("matrix(".length, -1).split(' ');
        for (let i = 0; i < matrix.length; i++) {
            matrix[i] = parseFloat(matrix[i]);
        }
        return matrix;
    }
}

if (typeof module !== "undefined") {
    module.exports = {
        MapItem,
        Shape,
    };
}
