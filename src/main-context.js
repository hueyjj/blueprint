// This file manages the entire state of each context and sidebar.

const Sidebar = require("./sidebar.js");
const ContextMenu = require("./context-menu.js");
const Svg = require("./svg-context.js");

var mainContainer = document.createElement("div");
mainContainer.className     = "main-container";
mainContainer.id            = "default-main-container";

var defaultSidebar = new Sidebar();
defaultSidebar.context = new ContextMenu();

mainContainer.appendChild(defaultSidebar.container);

//svg context
var item1 = defaultSidebar.context.newItem("new svg context");
item1.onclick = function () { 
    defaultSidebar.addButton(defaultSidebar.newButton());
    if (defaultSidebar.context.isVisible()) {
        defaultSidebar.context.hide();
    }
};

defaultSidebar.context.addItem(item1);
defaultSidebar.buttons["add"].onclick = function () {
    var x = defaultSidebar.buttons["add"].getBoundingClientRect().right,
        y = defaultSidebar.buttons["add"].getBoundingClientRect().top;

    defaultSidebar.context.show(x, y); //open option menu
}

document.body.onmousedown = function (e) {
    var ele = document.elementFromPoint(e.clientX, e.clientY);
    if ( !(ele.classList.contains("menu-item") || ele.classList.contains("menu")) ) {
        if (defaultSidebar.context.isVisible()) {
            defaultSidebar.context.hide();
        }
    }
}

var svg = new Svg();
mainContainer.appendChild(svg.container);
document.body.appendChild(mainContainer);
