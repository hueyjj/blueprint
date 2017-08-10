const Map = require("./Map.js");
const { Draggable } = require("./Draggable.js");

class MapItem extends Draggable {
    constructor(tagName, x, y, shape, tagDirection, group, map, parentMap) {
        super(x, y, null, group);
        
        this.pressed = false;
        this.connecting = false;

        let e = this.initEle(shape, x, y);
        this.element = e.ele;
        this.background = e.bg;
        this.shape = e.shape;
        
        this.tagName = tagName;
        this.tagDirection = tagDirection;

        let t = this.initTag();
        this.tag = t.tag;
        this.tagContainer = t.tagContainer;
        this.tagTextContainer = t.tagTextContainer;
        this.tagText = t.tagText;
        this.tagArrow = t.arrow;
        this.tagFocus = false;
        this.tagVisible = true;
        
        this.showTag();

        this.parentMap = parentMap;
        this.map = map;
        this.childMap = null;
       
        //Element
        this.element.onmouseover = (function (event) {
        }).bind(this);
        this.element.ondblclick = (function (event) {
        }).bind(this);
       
        //Map
        this.element.addEventListener("keydown", (function (event) {
            switch (event.key) {
                default: return;
            }
        }).bind(this));
        this.element.addEventListener("keyup", (function (event) {
            switch (event.key) {
                case "Delete":      this.map.remove(this);  break;
                case "Backspace":   this.map.remove(this);  break;
                case "m":           this.enterChildMap();   break;
                default: return;
            }
        }).bind(this));
        //this.map.map.addEventListener("keydown", (function (event) {
        //    switch (event.key) {
        //        case "b": this.enterParentMap();    break;
        //        default: return;
        //    }
        //}).bind(this));
        
        //Dragging
        this.element.onmousedown = (function (event) { 
            event.stopPropagation(); 
            this.startDragging(event.clientX, event.clientY); 
        }).bind(this);
        this.element.onmouseup = (function (event) { 
            event.stopPropagation(); 
            this.endDragging(); 
        }).bind(this);
       
        //Tag
        this.tagTextContainer.addEventListener("focusout", (function (event) {
            this.tagText.contentEditable = "false";
            this.tagFocus = false;
            //this.setTagDimensions();
        }).bind(this));
        this.tagTextContainer.addEventListener("dblclick", (function (event) {
            event.stopPropagation(); 
            this.tagText.contentEditable = "true";
            this.tagText.focus();
            this.tagFocus = true;
        }).bind(this));
        this.tagTextContainer.addEventListener("contextmenu", (function (event) {
            event.stopPropagation(); 
            this.toggleTagDirection();
        }).bind(this));
        this.tagTextContainer.addEventListener("mousedown", (function (event) {
            if (this.tagFocus) event.stopPropagation();
        }).bind(this));
        this.tagTextContainer.addEventListener("keydown", (function (event) {
        }).bind(this));

        this.tagText.addEventListener("keydown", (function (event) {
            event.stopPropagation();
            switch (event.key) {
                case "Escape": this.tagText.blur();
                default: return;
            }
        }).bind(this));
        this.tagText.addEventListener("keyup", (function (event) {
            event.stopPropagation();
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
        tagText.innerText = this.tagName ? this.tagName : "(empty)";
        tagText.contentEditable = "false";

        let arrowContainer = document.createElement("div");
        arrowContainer.classList = "arrow-container";

        let arrow = document.createElement("span");
        
        if (TagDirection.RIGHT == this.tagDirection) {
            tag.setAttribute("x", "1em");
            tag.setAttribute("y", "-.5em");
            tagContainer.classList.add("tag-container-right");
            tagTextContainer.classList.add("text-container-right");
            arrow.classList = "arrow-right";
        }
        else if (TagDirection.LEFT == this.tagDirection) {
            tag.setAttribute("x", "-1em");
            tag.setAttribute("y", "-.5em");
            tagContainer.classList.add("tag-container-left");
            tagTextContainer.classList.add("text-container-left");
            arrow.classList = "arrow-left";
        }
        else if (TagDirection.TOP == this.tagDirection) {
            tag.setAttribute("x", "-.5em");
            tag.setAttribute("y", "-3em");
            tagContainer.classList.add("tag-container-top");
            tagTextContainer.classList.add("text-container-top");
            arrow.classList = "arrow-top";
        }
        else if (TagDirection.BOTTOM == this.tagDirection) {
            tag.setAttribute("x", "-.5em");
            tag.setAttribute("y", "1em");
            tagContainer.classList.add("tag-container-bottom");
            tagTextContainer.classList.add("text-container-bottom");
            arrow.classList = "arrow-bottom";
        } 
        else {
            //Handle error here
        }

        tag.appendChild(tagContainer);
        tagContainer.appendChild(arrowContainer);
        tagContainer.appendChild(tagTextContainer);
        arrowContainer.appendChild(arrow);
        tagTextContainer.appendChild(tagText);
        
        return {tag, tagContainer, tagTextContainer, arrow, tagText};
    }

    //Run when this element is loaded into DOM
    runConfig() {
        //this.setTagDimensions();
    }

    showTag() {
        this.element.appendChild(this.tag);
    }

    hideTag() {
        this.element.removeChild(this.tag);
    }

    getTagName() {
        return this.tagText.textContent;
    }

    getPath() {
        let path = this.getTagName(),
            prevItem = this.map.parentItem;
        while (prevItem) {
            path = prevItem.getTagName() + " | " + path;
            prevItem = prevItem.map.parentItem;
        }
        return path;
    }

    toggleTagDirection() {
        switch (this.tagDirection) {
            case TagDirection.RIGHT:
                this.tagContainer.classList.remove("tag-container-right");
                this.tagTextContainer.classList.remove("text-container-right");
                this.tagArrow.classList.remove("arrow-right");
           
                //Bottom
                this.tag.setAttribute("x", "-.5em");
                this.tag.setAttribute("y", "1em");
                this.tagContainer.classList.add("tag-container-bottom");
                this.tagTextContainer.classList.add("text-container-bottom");
                this.tagArrow.classList.add("arrow-bottom");
                this.tagDirection = TagDirection.BOTTOM;
            break;
            case TagDirection.BOTTOM:
                this.tagContainer.classList.remove("tag-container-bottom");
                this.tagTextContainer.classList.remove("text-container-bottom");
                this.tagArrow.classList.remove("arrow-bottom");
           
                //Left
                this.tag.setAttribute("x", "-1em");
                this.tag.setAttribute("y", "-.5em");
                this.tagContainer.classList.add("tag-container-left");
                this.tagTextContainer.classList.add("text-container-left");
                this.tagArrow.classList.add("arrow-left");
                this.tagDirection = TagDirection.LEFT;
            break;
            case TagDirection.LEFT:
                this.tagContainer.classList.remove("tag-container-left");
                this.tagTextContainer.classList.remove("text-container-left");
                this.tagArrow.classList.remove("arrow-left");
            
                //Top
                this.tag.setAttribute("x", "-.5em");
                this.tag.setAttribute("y", "-3em");
                this.tagContainer.classList.add("tag-container-top");
                this.tagTextContainer.classList.add("text-container-top");
                this.tagArrow.classList.add("arrow-top");
                this.tagDirection = TagDirection.TOP;
            break;
            case TagDirection.TOP:
                this.tagContainer.classList.remove("tag-container-top");
                this.tagTextContainer.classList.remove("text-container-top");
                this.tagArrow.classList.remove("arrow-top");
               
                //Right
                this.tag.setAttribute("x", "1em");
                this.tag.setAttribute("y", "-.5em");
                this.tagContainer.classList.add("tag-container-right");
                this.tagTextContainer.classList.add("text-container-right");
                this.tagArrow.classList.add("arrow-right");
                this.tagDirection = TagDirection.RIGHT;
            break;
            default: return;
        }
    }

    //Elements must enter the DOM first, else dimensions will be zero
    //NOTE Might be opposite of intended effects...?
    setTagDimensions() {
        let children = this.tagContainer.hasChildNodes() ? this.tagContainer.childNodes : null;
        if (children) {
            let width = 0,
                height = 0;
            for (let i = 0; i < children.length; ++i) {
                if (children[i] instanceof Element) {
                    switch (this.tagDirection) {
                        case TagDirection.RIGHT:
                            width += children[i].clientWidth;
                            height = children[i].clientHeight > height ? children[i].clientHeight : height;
                        case TagDirection.BOTTOM:    break;
                        case TagDirection.LEFT:      break; 
                        case TagDirection.TOP:       break;
                        break;
                        default: return;
                    }
                }
            }
            this.tag.setAttribute("width", width);
            this.tag.setAttribute("height", height);
        }
    }

    enterChildMap() {
        if (!this.childMap) {
            this.childMap = new Map();
            this.childMap.parentItem = this;
            this.childMap.map.addEventListener("keydown", (function (event) {
                switch (event.key) {
                    case "b":
                        //Return to parent map
                        document.body.removeChild(this.childMap.container);
                        document.body.appendChild(this.map.container);
                        this.map.map.focus();
                        break;
                    default: return;
                }
            }).bind(this));
        }
        if (this.map && this.childMap) {
            this.childMap.setPath(this.getPath());
            document.body.removeChild(this.map.container);
            document.body.appendChild(this.childMap.container);
            this.childMap.map.focus();
        }
    }

    enterParentMap() {
        //if (this.map && this.parentMap 
        //    && !document.body.contains(this.parentMap.container)) {
        //    document.body.removeChild(this.map.container);
        //    document.body.appendChild(this.parentMap.container);
        //    this.parentMap.map.focus();
        //}
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
