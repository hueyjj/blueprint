function ContextMenu() {
    container: null;
    menu: null;
    visible: false;

    isVisible: null;
    newItem: null;
    addItem: null;
    show: null;
    hide: null;
}

ContextMenu.prototype.menu = document.createElement("ul");
ContextMenu.prototype.menu.className = "menu";
ContextMenu.prototype.menu.id = "right-click-menu";

ContextMenu.prototype.isVisible = function () {
    return this.visible || document.getElementsByClassName("menu").length > 0;
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
    document.body.removeChild(this.menu);

    this.visible = false;
}

module.exports = ContextMenu;
