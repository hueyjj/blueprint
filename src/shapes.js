function Shape() {
    shape: null; //holds enum type
    ele: null; //reference to element

    parent: null; //reference to goup tag for matrix operation

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
        shapeEle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        shapeEle.setAttribute("cx", x);
        shapeEle.setAttribute("cy", y);
        shapeEle.setAttribute("r", 5);
    }
    else if (this.Enum.TRIANGLE == this.shape) {
        shapeEle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        //TODO implement this
    }
    else if (this.Enum.SQUARE == this.shape) {
        shapeEle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        shapeEle.setAttribute("x", x);
        shapeEle.setAttribute("y", y);
        shapeEle.setAttribute("width", 5);
        shapeEle.setAttribute("height", 5);
    }
    else if (this.Enum.PENTAGON == this.shape) {
        shapeEle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        //TODO implement this
    }
    else {
        console.error("unable to create shape for " + this.shape);
        return;
    }

    if (shapeEle) {
        shapeEle.setAttribute("transform", `matrix(1 0 0 1 0 0)`);
    }
    
    return shapeEle;
}

Shape.prototype.translatePos = function (destX, destY) {
    let dx = destX - this.x,
        dy = destY - this.y;

    let matrix = this.getMatrix(this.ele, "transform"),
        matrix2 = this.getMatrix(this.parent, "transform");

    // Translation
    // Scale down/up translation distance for zoom
    if (this.ele == this.parent) {
        dx += matrix[4]; 
        dy += matrix[5];
    }
    else {
        dx = matrix[4] + (dx / matrix2[0]); //scaling factor
        dy = matrix[5] + (dy / matrix2[3]);
    }

    let matrixValue = `matrix(${matrix[0]} ${matrix[1]} ${matrix[2]} ${matrix[3]} ${dx} ${dy})`;

    this.ele.setAttribute("transform", matrixValue); 
    this.x = destX;
    this.y = destY;
}

Shape.prototype.getMatrix = function (element, attr) {
    let matrix = element.getAttribute(attr).slice("matrix(".length, -1).split(' ');
    for (let i = 0; i < matrix.length; i++)
    {
        matrix[i] = parseFloat(matrix[i]);
    }

    return matrix;
}

module.exports = Shape;
