class NavigationBar {
    constructor() {
        this.menu = null;

        this.element = document.createElement("div");
        this.element.classList = "nav-bar";
        this.element.oncontextmenu = null;
        
        this.list = document.createElement("div");
        this.list.classList = "nav-list";
        
        this.element.appendChild(this.list);
    }

    onClick(fn) {
        this.list.onclick = fn;
    }

    onMenu(fn) {
        this.list.oncontextmenu = fn;
    }

    append(item) {
        this.list.appendChild(item.element);
    }

    remove(item) {
        this.list.removeChild(item.element);
    }
}

if (typeof module !== "undefined") 
    module.exports = NavigationBar;
