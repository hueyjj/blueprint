function ContextMenu() {
    this.menu = document.createElement("ul");
    this.menu.className = "menu";
    this.menu.id = "right-click-menu";

    this.visible = false;

    container: null;

    newItem: null;
    addItem: null;
    show: null;
    hide: null;
}

ContextMenu.prototype.isVisible = function () {
    return this.visible;
}

ContextMenu.prototype.newItem = function (text) {
    var item = document.createElement("li");
    item.className = "menu-item";
    item.innerHTML = "--insert text--";

    if (text)
        item.innerHTML = text;

    return item;
}

ContextMenu.prototype.addItem = function (item) {
    this.menu.appendChild(item);
}

ContextMenu.prototype.show = function (x, y) {
    this.menu.style.left = x + "px";
    this.menu.style.top = y + "px";
    this.menu.style.display = "block";

    document.body.appendChild(this.menu);

    this.visible = true;
}

ContextMenu.prototype.hide = function () {
    this.menu.style.display = "none";
    this.visible = false;

    document.body.removeChild(this.menu);
}

module.exports = ContextMenu;
