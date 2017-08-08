class Draggable {
    constructor(x, y, element, group) {
        this.initX = x;
        this.initY = y;
        this.x = 0; //Do not use for real time update, not synced
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.element = null; 
        this.group = group;
        this.connections = [];
        this.connecting = false;
    
        this.id = (function () {
            let randomID = new Uint32Array(1);
            window.crypto.getRandomValues(randomID);
            return randomID;
        })();
    }

    startDragging(x, y) {
        this.x = x; this.y = y;
        document.body.onmousemove = (function (e) {
            this.translate(e.clientX, e.clientY);
        }).bind(this);
    }

    endDragging() {
        document.body.onmousemove = null;
    }

    translate(destX, destY) {
        this.dx = destX - this.x;
        this.dy = destY - this.y;

        let elementMatrix = this.matrix(this.element),
            groupMatrix = this.matrix(this.group);

        //Scale down/up translation distance for groupMatrix
        if (this.element == this.group) {
            this.dx += elementMatrix[0]; 
            this.dy += elementMatrix[1];
        }
        else {
            this.dx = elementMatrix[0] + (this.dx / groupMatrix[2]); //Zoom scale factor
            this.dy = elementMatrix[1] + (this.dy / groupMatrix[3]);
        }

        this.x = destX;
        this.y = destY;
       
        let matrixValue = `translate(${this.dx},${this.dy}) scale(${elementMatrix[2]},${elementMatrix[3]}) `;
        this.element.setAttribute("transform", matrixValue); 

        //Handle connections here
        if (this.connections.length > 0) {
            for (let i = 0; i < this.connections.length; ++i) {
                let connection = this.connections[i];
                let newX = this.dx,
                    newY = this.dy;

                if (ConnectionType.START == connection.type) {
                    let conValue = connection.getTranslatedValue(), 
                        oldX = conValue[0], 
                        oldY = conValue[1];
                    oldX -= newX, oldY -= newY;
                    connection.path.setAttribute("d", `m ${newX},${newY} l ${oldX},${oldY}`);
                }
                else if (ConnectionType.END == connection.type) {
                    let old = connection.path.getAttribute("d").match(/[-+]?(\d+)?\.?\d+/g),
                        oldX = old[0],
                        oldY = old[1];
                    newX -= oldX, newY -= oldY;
                    connection.path.setAttribute("d", `m ${oldX},${oldY} l ${newX},${newY}`);
                }
                else {
                    //Invalid connection
                }
            }
        }
    }

    matrix(e) {
        let matrixValue = e.getAttribute("transform").match(/\(([^)]+)\)/g);
        let translateValue = matrixValue[0].split(',', 2);
        let scaleValue = matrixValue[1].split(',', 2);

        let translateValueX = translateValue[0].match(/[-+]?(\d+)?\.?\d+/),
            translateValueY = translateValue[1].match(/[-+]?(\d+)?\.?\d+/);

        let scaleValueX = scaleValue[0].match(/[-+]?(\d+)?\.?\d+/),
            scaleValueY = scaleValue[1].match(/[-+]?(\d+)?\.?\d+/);
        
        let matrix = [
            parseFloat(translateValueX[0]),
            parseFloat(translateValueY[0]),
            parseFloat(scaleValueX[0]),
            parseFloat(scaleValueY[0]),
        ];
        return matrix;
    }

    getTranslate(e) {
        let matrixValue = e.getAttribute("transform").match(/\(([^)]+)\)/g);
        let translateValue = matrixValue[0].split(',', 2);

        let translateValueX = translateValue[0].match(/[-+]?(\d+)?\.?\d+/),
            translateValueY = translateValue[1].match(/[-+]?(\d+)?\.?\d+/);
        
        let matrix = [
            parseFloat(translateValueX[0]),
            parseFloat(translateValueY[0]),
        ];
        return matrix;
    }

    getScale(e) {
        let matrixValue = e.getAttribute("transform").match(/\(([^)]+)\)/g);
        let scaleValue = matrixValue[1].split(',', 2);

        let scaleValueX = scaleValue[0].match(/[-+]?(\d+)?\.?\d+/),
            scaleValueY = scaleValue[1].match(/[-+]?(\d+)?\.?\d+/);
        
        let matrix = [
            parseFloat(scaleValueX[0]),
            parseFloat(scaleValueY[0]),
        ];
        return matrix;
    }

    //Without transformation (NOTE: do not use if element transformation includes scaling
    //because element.getBoundingClientRect method uses DOM coordinate system. DOM to SVG system
    //is _not_ accurate and will not produce the desired coordinates in the SVG system. e.g When
    //an SVG is scaled to say .1 the DOM system will not be able to get the exact coordinate
    //leading to a completely misplaced/miscentered element.
    //getCenterX() {
    //    if (this.element) {
    //        let rect = this.element.getBoundingClientRect();
    //        //console.log(rect);
    //        //console.log("x:", rect.left + rect.width/2);
    //        return rect.left + rect.width/2;
    //    }
    //}

    //getCenterY() {
    //    if (this.element) {
    //        let rect = this.element.getBoundingClientRect();
    //        //console.log(rect);
    //        //console.log("y:", rect.top + rect.height/2);
    //        return rect.top + rect.height/2;
    //    }
    //}

    addConnection(link) {
        if (!this.hasConnection(link.id)) {
            this.connections.push(link);
            return true;
        }
        return false;
    }

    removeConnection(id) {
        //console.log("removing..");
        if (this.hasConnection(id)) {
            let index;
            for (let i = 0; i < this.connections.length; ++i) {
                if (this.connections[i].id == id) index = i;
            }
            this.connections.splice(index, 1);
            //console.log("remove ok");
        }
    }

    hasConnection(id) {
        for (let i = 0; i < this.connections.length; ++i) {
            if (this.connections[i].id == id) return true;
        }
        return false;
    }
}

const ConnectionType = {
    START:      "START",
    END:        "END",
}

if (typeof module !== "undefined")
    module.exports = { 
        Draggable,
        ConnectionType,
    }
