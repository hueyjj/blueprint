class NavigationSubList {
    constructor(text, parent=null) {
        this.menu = null;
        this.text = text ? text : "[no text set]";
        this.parent = parent ? parent : null; //reference to an element
        
        this.items = [];
        this.expanded = false;

        // list
        this.element = document.createElement("div");
        this.element.classList = "nav-sub-list";

        // text
        this.span = document.createElement("span");
        this.span.classList = "nav-text";
        this.span.textContent = this.text;

        this.element.appendChild(this.span);
        
        let defaultToggleShow = this.toggle.bind(this);
        let defaultSelect = this.setSelect.bind(this);
        this.span.onclick = function (e) {
            defaultSelect();
            defaultToggleShow();    
            e.stopPropagation();
        };
        
        this.setCollapsed();
        this.hideContent();
    }

    onClick(fn) {
        var that = this;
        that.span.onclick = function (e) {
            fn(e)
            that.setSelect();
            that.toggle();
        };
    }

    onMenu(fn) {
        this.div.oncontextmenu = fn;
    }

    setMenu(menu) {
        this.menu = menu;
        this.element.appendChild(this.menu.element);
    }

    removeClick() {
        this.element.onclick = null;
    }

    removeMenu() {
        this.element.oncontextmenu = null;
    }

    append(item) {
        //this.element.appendChild(item.element);
        this.items.push(item);
    }

    remove(item) { //TODO haven't tested
        this.element.removeChild(item.element);

        let i = this.items.indexOf(item);
        this.items.splice(i, 1);
    }

    setExpanded() {
        this.expanded = true;
        this.element.classList.add("expanded");
        this.element.classList.remove("collapsed");
    }

    setCollapsed() {
        this.expanded = false;
        this.element.classList.remove("expanded");
        this.element.classList.add("collapsed");
    }

    hideContent() {
        for (let i = 0; i < this.element.childNodes.length; ) {
            let child = this.element.childNodes[i]; 
            let name = child.nodeName.toLowerCase();
            if ("div" == name) { 
                this.element.removeChild(child); //remove all sub lists and items
            } else {
                i++; //move to next child 
            }
        }
    }

    showContent() {
        for (let i = 0; i < this.items.length; i++) {
            this.element.appendChild(this.items[i].element);
        }
    }

    toggle() {
        if (this.expanded) {
            this.setCollapsed();
            this.hideContent();
        } else {
            this.setExpanded();
            this.showContent();
        }
    }

    setSelect() {
        var ele = document.getElementsByClassName("selected");
        for (let i = 0; i < ele.length; i++) {
            ele[i].classList.remove("selected");
        }
        this.span.classList.add("selected");
    }
}


if (typeof module !== "undefined") 
    module.exports = NavigationSubList;
