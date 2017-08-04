class TreeItem {
    constructor(text, parent=null) {
        this.text = text ? text.toUpperCase() : null;
        this.parent = parent ? parent : null; //reference to an element
        this.menu = null; //reference to menu object

        this.element = document.createElement("li");
        this.element.classList = "tree-item";

        this.div = document.createElement("div");
        this.div.classList = "tree-item-container";

        this.span = document.createElement("span");
        this.span.classList = "icon tree-item-text";
        this.span.textContent = this.text;

        let defaultSelect = this.setSelect.bind(this);
        this.element.onclick = function(e) { defaultSelect(); e.stopPropagation(); };
        this.element.oncontextmenu = null;

        this.div.appendChild(this.span);
        this.element.appendChild(this.div);
    }

    onClick(fn) {
        this.element.onclick = (function (e) {
            fn(e)
            this.setSelect();
        }).bind(this);
    }

    onMenu(fn) {
        this.element.oncontextmenu = fn;
    }

    setMenu(menu) {
        this.menu = menu;
    }

    showMenu(x, y) {
        //TODO set element highest and display menu and make the menu belong to this element
    }

    removeClick() {
        this.element.onclick = null;
    }

    removeMenu() {
        this.element.oncontextmenu = null;
    }

    setText(text) {
        this.text = text;
        this.span.textContent = this.text;
    }

    getText() {
        return this.span.textContent;
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
    module.exports = TreeItem;
