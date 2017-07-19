class TreeView {
    constructor() {
        this.menu = null;

        this.element = document.createElement("div");
        this.element.classList = "tree-view-container";

        this.tree = document.createElement("div");
        this.tree.classList = "tree-view";
        this.tree.oncontextmenu = null;

        this.list = document.createElement("ul");
        this.list.classList = "root-tree-list tree-list";

        this.tree.appendChild(this.list);
        this.element.appendChild(this.tree);
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

module.exports = TreeView;
