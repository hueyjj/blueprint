class Draggable {
    constructor(x, y, element, group) {
        this.x = x; //Do not use for real time update, not synced
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.element = null; 
        this.group = group;
        //this.connection = null;
        this.connections = [];
        //this.connectionType = null;
        this.connecting = false;
    
        this.id = (function () {
            var randomID = new Uint32Array(1);
            window.crypto.getRandomValues(randomID);
            return randomID;
        })();
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

        //Handle connection here
        if (this.connections.length > 0) {
            //let temp = this.group.getAttribute("transform");
            //this.group.setAttribute("transform", `translate(${this.dx},${this.dy}) scale(1,1)`);
            for (let i = 0; i < this.connections.length; ++i) {
                let con = this.connections[i];
                let old = con.path.getAttribute("d").match(/[-+]?(\d+)?\.?\d+/g);
                let newX = this.getCenterX() - groupMatrix[0],
                    newY = this.getCenterY() - groupMatrix[1];
                
                //console.log("**************************************************");
                //console.log("sub trans: %f, %f scale: %f, %f center: %f, %f", 
                //    newX, newY, groupMatrix[2], groupMatrix[3], this.getCenterX(), this.getCenterY());
                //console.log("new: %f, %f", newX, newY);
                
                //Match group scaling
                newX = newX / groupMatrix[2];
                newY = newY / groupMatrix[3];
                
                //console.log(this.element);
                //console.log(this.element.getCTM());
                //console.log(this.element.getScreenCTM());
                //console.log(this.element.getBBox());
                //console.log(this.element.getBoundingClientRect());
                //newX = newX / this.element.getScreenCTM().a;
                //newY = newY / this.element.getScreenCTM().a;
                
                //console.log("new: %f, %f", newX, newY);

                if (con.type == ConnectionType.START) {
                    con.path.setAttribute("d", `M ${newX}, ${newY} L ${old[2]}, ${old[3]}`);
                }
                else if (con.type == ConnectionType.END) {
                    con.path.setAttribute("d", `M ${old[0]}, ${old[1]} L ${newX}, ${newY}`);
                }
                else {
                    //Invalid connection
                }
            }
            //this.group.setAttribute("transform", temp);
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
        
        //console.log("translate: %s, %s scale: %s, %s", 
        //    translateValueX[0], translateValueY[0], scaleValueX[0], scaleValueY[0]);

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

    //Without transformation
    getCenterX() {
        if (this.element) {
            let rect = this.element.getBoundingClientRect();
            //console.log(rect);
            //console.log("x:", rect.left + rect.width/2);
            return rect.left + rect.width/2;
        }
    }

    getCenterY() {
        if (this.element) {
            let rect = this.element.getBoundingClientRect();
            //console.log(rect);
            //console.log("y:", rect.top + rect.height/2);
            return rect.top + rect.height/2;
        }
    }

    addConnection(link) {
        if (!this.hasConnection(link.id)) {
            this.connections.push(link);
            return true;
        }
        return false;
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
