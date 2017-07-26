class NavigationItem {
    constructor(text, parent=null) {
        this.text = text ? text : "[no text set]";
        this.parent = parent ? parent : null; //reference to an element
        this.menu = null; //reference to right-click menu object

        this.element = document.createElement("div");
        this.element.classList = "nav-item";

        this.span = document.createElement("span");
        this.span.classList = "nav-text";
        this.span.textContent = this.text;

        let defaultSelect = this.setSelect.bind(this);
        this.span.onclick = function(e) { defaultSelect(); e.stopPropagation(); };
        this.span.oncontextmenu = null;

        this.element.appendChild(this.span);
    }

    onClick(fn) {
        var that = this; //TreeItem object
        that.span.onclick = function (e) {
            fn(e)
            that.setSelect();
        };
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
        this.span.classList.add("selected");
    }
}


if (typeof module !== "undefined") 
    module.exports = NavigationItem;
