function Shape() {
    Enum: null;

    shape: null; // enum type
    ele: null; // reference to element

    newShape: null;
    translatePos: null;
}

Shape.prototype.Enum = {
    CIRCLE: 0,
    TRIANGLE: 1,
    SQUARE: 2,
    PENTAGON: 3,
}

// Returns polygon, circle, rectangle element
Shape.prototype.newShape = function (x, y) {
    var shapeEle = null;
    if (this.Enum.CIRCLE == this.shape) {
        shapeEle = document.createElement("circle");
        shapeEle.setAttribute("cx", x);
        shapeEle.setAttribute("cy", y);
        shapeEle.setAttribute("r", 5);
    }
    else if (this.Enum.TRIANGLE == this.shape) {
        shapeEle = document.createElement("polygon");
        //TODO implement this
    }
    else if (this.Enum.SQUARE == this.shape) {
        shapeEle = document.createElement("rect");
        shapeEle.setAttribute("x", x);
        shapeEle.setAttribute("y", y);
        shapeEle.setAttribute("width", 5);
        shapeEle.setAttribute("height", 5);
    }
    else if (this.Enum.PENTAGON == this.shape) {
        shapeEle = document.createElement("polygon");
        //TODO implement this
    }
    else {
        console.error("unable to create shape for " + this.shape);
        return;
    }
    
    return shapeEle;
}

module.exports = Shape;
