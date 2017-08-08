const { Draggable } = require("./Draggable.js");

class MapItem extends Draggable {
    constructor(tagName, x, y, shape, group, tagDirection) {
        super(x, y, null, group);

        this.tagName = tagName;
        this.tagDirection = TagDirection.LEFT; //tagDirection;

        this.pressed = false;
        this.connecting = false;

        let e = this.initEle(shape, x, y);
        this.element = e.ele;
        this.background = e.bg;
        this.shape = e.shape;
        
        let t = this.initTag();
        this.tag = t.tag;
        this.tagContainer = t.tagContainer;
        this.tagTextContainer = t.tagTextContainer;
        this.tagText = t.tagText;
        this.tagFocus = false;
        this.tagVisible = true;
        
        this.showTag();
        
        //Dragging
        this.element.onmousedown = (function (event) { 
            this.startDragging(event.clientX, event.clientY); 
            event.stopPropagation(); 
        }).bind(this);
        this.element.onmouseup = (function (event) { 
            this.endDragging(); 
            event.stopPropagation(); 
        }).bind(this);
        this.element.onmouseover = (function (event) {
        }).bind(this);
        this.element.onclick = (function (event) {
        }).bind(this);
       
        //TODO Implement tag position top and bottom, exclude left (too difficult to do)
        //Tag
        this.tagTextContainer.addEventListener("focusout", (function (event) {
            this.tagText.contentEditable = "false";
            this.tagFocus = false;
            this.setTagDimensions();
        }).bind(this));
        this.tagTextContainer.addEventListener("dblclick", (function (event) {
            this.tagText.contentEditable = "true";
            this.tagText.focus();
            this.tagFocus = true;
        }).bind(this));
        this.tagTextContainer.addEventListener("mousedown", (function (event) {
            if (this.tagFocus) event.stopPropagation();
        }).bind(this));
        this.tagTextContainer.addEventListener("keydown", (function (event) {
            switch (event.key) {
                case "Escape": this.tagText.blur();
                default: return;
            }
        }).bind(this));


        //NOTE If continue to drag off screen and then mouse returns to the map,
        //the item will stick to the mouse without the mouse being down.
        //TODO end dragging for all elements with one event listener later 
        //should have some sort of data structure to reference all the map items
        document.addEventListener("mouseleave", (() => { this.endDragging(); }).bind(this));
    }

    initEle(sh, x, y) {
        let ele = null; 
        
        let shape = null;
        let bg = null;
        
        if (Shape.CIRCLE == sh) {
            shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            shape.classList = "circle";
            //shape.setAttribute("cx", x);
            //shape.setAttribute("cy", y);
            shape.setAttribute("r", 5);
            bg = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            bg.classList = "circle-background";
            //bg.setAttribute("cx", x);
            //bg.setAttribute("cy", y);
            bg.setAttribute("r", 10);
        }
        else if (Shape.TRIANGLE == sh) {
            //TODO Implement this
            shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        }
        else if (Shape.SQUARE == sh) {
            //TODO Implement this
            shape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            //shape.setAttribute("x", x);
            //shape.setAttribute("y", y);
            shape.setAttribute("width", 5);
            shape.setAttribute("height", 5);
        }
        else if (Shape.PENTAGON == sh) {
            //TODO Implement this
            shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        }
        else {
            console.error("[error] no shape for " + sh);
            return;
        }

        if (shape && bg) {
            ele = document.createElementNS("http://www.w3.org/2000/svg", "g");
            ele.classList = "map-item";
            ele.setAttribute("tabindex", 0);
            ele.setAttribute("transform", `translate(0,0) scale(1,1)`);
            ele.appendChild(bg);
            ele.appendChild(shape);
        }
        else {
            ele = null;
            console.error("[error] unable to create element for " + sh + " at " + x + ", " + y);
        }

        return {ele, shape, bg};
    }

    initTag() {
        let tag = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        tag.classList = "tag";
        
        let tagContainer = document.createElement("div");
        tagContainer.classList = "tag-container";
        
        let tagTextContainer = document.createElement("div");
        tagTextContainer.classList = "text-container";

        //TODO Might have to handle line breaks
        let tagText = document.createElement("span");
        tagText.classList = "tag-text";
        tagText.textContent = this.tagName ? this.tagName : "(empty)";
        tagText.contentEditable = "false";

        let arrowContainer = document.createElement("div");
        arrowContainer.classList = "arrow-container";

        let arrow = document.createElement("span");
        
        if (TagDirection.RIGHT == this.tagDirection) {
            tag.setAttribute("x", "1em");
            tag.setAttribute("y", "-.5em");
            arrow.classList = "arrow-right";
        }
        else if (TagDirection.LEFT == this.tagDirection) {
            tag.setAttribute("x", "-2em");
            tag.setAttribute("y", "-.5em");
            tagContainer.classList.add("tag-container-left");
            arrow.classList = "arrow-left";
        }
        else if (TagDirection.TOP == this.tagDirection) {
        }
        else if (TagDirection.BOTTOM == this.tagDirection) {
        } 
        else {
            //Handle error here
        }

        tag.appendChild(tagContainer);
        tagContainer.appendChild(arrowContainer);
        tagContainer.appendChild(tagTextContainer);
        arrowContainer.appendChild(arrow);
        tagTextContainer.appendChild(tagText);
        
        return {tag, tagContainer, tagTextContainer, tagText};
    }

    //Run when this element is loaded into DOM
    runConfig() {
        this.setTagDimensions();
    }

    showTag() {
        this.element.appendChild(this.tag);
    }

    hideTag() {
        this.element.removeChild(this.tag);
    }

    //Elements must enter the DOM first, else dimensions will be zero
    setTagDimensions() {
        /*
        let children = this.tagContainer.hasChildNodes() ? this.tagContainer.childNodes : null;
        if (children) {
            let width = 0,
                height = 0;
            for (let i = 0; i < children.length; ++i) {
                if (children[i] instanceof Element) {
                    width += children[i].clientWidth;
                    height = children[i].clientHeight > height ? children[i].clientHeight : height;
                }
            }
            this.tag.setAttribute("width", width);
            this.tag.setAttribute("height", height);
        }
        */
    }
}

const Shape = {
    CIRCLE:         "CIRCLE",
    TRIANGLE:       "TRIANGLE",
    SQUARE:         "SQUARE",
    PENTAGON:       "PENTAGON",
}

const TagDirection = {
    LEFT:   "LEFT",
    RIGHT:  "RIGHT",
    TOP:    "TOP",
    BOTTOM: "BOTTOM",
}

if (typeof module !== "undefined")
    module.exports = {
        MapItem,
        Shape,
        TagDirection,
    };
