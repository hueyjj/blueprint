class Draggable {
    constructor(x, y, element, group) {
        this.x = x;
        this.y = y;
        this.element = null; 
        this.group = group;
    }

    //can access parent variable directly, but left here just as a reminder
    setElement(element) {
        this.element = element;
    }
    
    startDragging(x, y) {
        var that = this;
        that.x = x; that.y = y;
        document.body.onmousemove = function (e) {
            that.translatePos(e.clientX, e.clientY);
        };
    }

    endDragging() {
        document.body.onmousemove = null;
    }

    translatePos(destX, destY) {
        let dx = destX - this.x,
            dy = destY - this.y;

        let originalPos = this.getMatrix(this.element),
            zoom = this.getMatrix(this.group);

        // Scale down/up translation distance for zoom
        if (this.element == this.group) {
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

if (typeof module !== "undefined")
    module.exports = Draggable;
