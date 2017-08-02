class Draggable {
    constructor(x, y, element, group) {
        this.x = x; //Do not use for real time update, not synced
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.element = null; 
        this.group = group;
        this.connection = null;
        this.connections = [];
        this.connectionType = null;
    }

    //can access parent variable directly, but left here just as a reminder
    setElement(element) {
        this.element = element;
    }
    
    startDragging(x, y) {
        var that = this;
        that.x = x; that.y = y;
        document.body.onmousemove = function (e) {
            that.translate(e.clientX, e.clientY);
        };
    }

    endDragging() {
        document.body.onmousemove = null;
    }

    translate(destX, destY) {
        this.dx = destX - this.x;
        this.dy = destY - this.y;

        let originalPos = this.getMatrix(this.element),
            groupTrans = this.getMatrix(this.group);

        //Scale down/up translation distance for groupTrans
        if (this.element == this.group) {
            this.dx += originalPos[4]; 
            this.dy += originalPos[5];
        }
        else {
            this.dx = originalPos[4] + (this.dx / groupTrans[0]); //Zoom scale factor
            this.dy = originalPos[5] + (this.dy / groupTrans[3]);
        }

        this.x = destX;
        this.y = destY;
        
        let matrixValue = `matrix(${originalPos[0]} ${originalPos[1]} ${originalPos[2]} ${originalPos[3]} ${this.dx} ${this.dy})`;
        this.element.setAttribute("transform", matrixValue); 

        //Handle connection here
        //if (this.connection) {
        //    let old = this.connection.getAttribute("d").match(/[-+]?\d+/g);
        //    let newX = this.getCenterX() - groupTrans[4],
        //        newY = this.getCenterY() - groupTrans[5];
        //    
        //    //console.log("Prev -- %s, %s, %s, %s", old[0],old[1],old[2],old[3]);
        //    //console.log("%s -- New: %d, %d Center: %d, %d Translation: %d, %d", 
        //        //this.connectionType, newX, newY, this.getCenterX(), this.getCenterY(), groupTrans[4], groupTrans[5]);
        //    if (this.connectionType == ConnectionType.START) {
        //        this.connection.setAttribute("d", `M ${newX}, ${newY} L ${old[2]}, ${old[3]}`);
        //        //console.log(this.connection.getAttribute("d"));
        //    }
        //    else if (this.connectionType == ConnectionType.END) {
        //        this.connection.setAttribute("d", `M ${old[0]}, ${old[1]} L ${newX}, ${newY}`);
        //        //console.log(this.connection.getAttribute("d"));
        //    }
        //    else {
        //        //Invalid connection
        //    }
        //}

        if (this.connections.length > 0) {
            for (let i = 0; i < this.connections.length; ++i) {
                let old = this.connections[i].getAttribute("d").match(/[-+]?\d+/g);
                let newX = this.getCenterX() - groupTrans[4],
                    newY = this.getCenterY() - groupTrans[5];
                
                if (this.connectionType == ConnectionType.START) {
                    this.connections[i].setAttribute("d", `M ${newX}, ${newY} L ${old[2]}, ${old[3]}`);
                }
                else if (this.connectionType == ConnectionType.END) {
                    this.connections[i].setAttribute("d", `M ${old[0]}, ${old[1]} L ${newX}, ${newY}`);
                }
                else {
                    //Invalid connection
                }
            }
        }
    }

    getMatrix(e) {
        let matrix = e.getAttribute("transform").slice("matrix(".length, -1).split(' ');
        for (let i = 0; i < matrix.length; i++) {
            matrix[i] = parseFloat(matrix[i]);
        }
        return matrix;
    }

    //Without transformation
    getCenterX() {
        if (this.element) {
            let rect = this.element.getBoundingClientRect();
            //let rect = this.element.getCTM();
            return rect.left + rect.width/2;
            //return rect.e;
        }
    }

    getCenterY() {
        if (this.element) {
            let rect = this.element.getBoundingClientRect();
            //let rect = this.element.getCTM();
            //return rect.f;
            return rect.top + rect.height/2;
        }
    }

    addConnection(con) {
        this.connections.push(con);
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
