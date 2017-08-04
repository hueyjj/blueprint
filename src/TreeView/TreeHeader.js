class TreeHeader {
    constructor(text, parent=null) {
        this.menu = null;
        this.text = text ? text.toUpperCase() : null;
        this.parent = parent ? parent : null; //reference to an element
        this.children = [];
        this.expanded = false;

        this.element = document.createElement("li");
        this.element.classList = "tree-header-item collapsed";

        this.div = document.createElement("div");
        this.div.classList = "tree-header-container";
        
        this.span = document.createElement("span");
        this.span.classList = "tree-header-text";
        this.span.textContent = this.text;

        this.list = document.createElement("ul");
        this.list.classList = "tree-list";

        this.div.appendChild(this.span);
        this.element.appendChild(this.div);
        this.element.appendChild(this.list);
        
        let defaultToggle = this.toggle.bind(this);
        let defaultSelect = this.setSelect.bind(this);
        this.element.onclick = function (e) {
            defaultSelect();
            defaultToggle();    
            e.stopPropagation();
        };
    }

    onClick(fn) {
        this.element.onclick = (function (e) {
            fn(e)
            this.setSelect();
            this.toggle();
        }).bind(this);
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
        this.children.push(item);
    }

    remove(item) { //TODO haven't tested
        this.element.removeChild(item.element);

        let i = this.children.indexOf(item);
        this.children.splice(i, 1);
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
        for (let i = 0; i < this.list.childNodes.length; ) {
            let child = this.list.childNodes[i]; 
            let name = child.nodeName.toLowerCase();
            if ("ul" == name || "li" == name) { 
                this.list.removeChild(child); //remove all sub lists and items
            } else {
                i++; //move to next child 
            }
        }
    }

    showContent() {
        for (let i = 0; i < this.children.length; i++) {
            this.list.appendChild(this.children[i].element);
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
        this.div.classList.add("selected");
    }
}


if (typeof module !== "undefined") 
    module.exports = TreeHeader;
