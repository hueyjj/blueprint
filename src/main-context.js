// This file manages the entire state of each context and sidebar.

const TreeView = require("./TreeView/TreeView.js");
const TreeHeader = require("./TreeView/TreeHeader.js");
const TreeItem = require("./TreeView/TreeItem.js");

const Menu = require("./Menu/menu.js");

var mainContainer = document.createElement("div");
mainContainer.className     = "main-container";
mainContainer.id            = "default-main-container";

var tree = new TreeView();
var header = new TreeHeader("HeaderOne"),
    header2 = new TreeHeader("HeaderTwo");
var item = new TreeItem("ItemOne", header),
    item2 = new TreeItem("ItemTwo", header2);
item.onClick(function (event) {
    console.log("before change: " + item.getText() + " clicked");
    item.setText("different text");
    console.log("after change: " + item.getText() + " clicked");
    event.stopPropagation();
});
item2.onClick(function (event) {
    console.log("before change: " + item2.getText() + " clicked");
    item2.setText("different text");
    console.log("after change: " + item2.getText() + " clicked");
    event.stopPropagation();
});
header.onClick(function (event) {
    console.log(header.text + " clicked");
    event.stopPropagation();
});
//header2.onClick(function (event) {
//    console.log(header2.text + " clicked");
//    event.stopPropagation();
//});
tree.onClick(function (event) {
    console.log("tree clicked");
    event.stopPropagation();
});

header.append(item);
header2.append(item2);
header.append(header2);
tree.append(header);

//long horizontal list
var rootHeader = prevHeader = new TreeHeader("root header");
for (let i = 0; i < 15; i++) {
    let h = new TreeHeader("header " + i);
    let item = new TreeItem("item " + i, h);
    let item1 = new TreeItem("item " + i, h);
    let item2= new TreeItem("item " + i, h);
    let item3= new TreeItem("item " + i, h);
    let item4= new TreeItem("item " + i, h);
    h.append(item);
    h.append(item1);
    h.append(item2);
    h.append(item3);
    h.append(item4);
    if (prevHeader) {
        prevHeader.append(h);
    }
    prevHeader = h;
}
tree.append(rootHeader);

//long vertical list
for (let i = 0; i < 100; i++) {
    let headerX = new TreeHeader("Header X " + i);
    headerX.onClick(function (event) {
        console.log(headerX.text + " clicked");
        event.stopPropagation();
    });
    tree.append(headerX);
}

mainContainer.append(tree.element);
document.body.append(mainContainer);

var menu = new Menu([
    {
        name: "text", fn: function (event) { 
            console.log("text");
            event.stopPropagation();
        }
    },
    {
        name: "next", fn: function (event) {
            console.log("next");
            event.stopPropagation();
        }
    },
]);

header2.setMenu(menu)
header2.onMenu(function (event) {
    header2.menu.move(event.clientX, event.clientY);
    header2.menu.show();
    event.stopPropagation();
});

//document.body.appendChild(menu.element);
//document.body.oncontextmenu = function (event) {
//    menu.show();
//    menu.move(event.clientX, event.clientY);
//    event.preventDefault();
//};

document.body.onclick = function (event) {
    var elementClicked = document.elementFromPoint(event.clientX, event.clientY);
    if (!(elementClicked.classList.contains("menu") 
            || elementClicked.classList.contains("menu-list")
            || elementClicked.classList.contains("menu-item")
            || elementClicked.classList.contains("menu-text"))) {
        var menuElements = document.getElementsByClassName("menu");
        for (let i = 0; i < menuElements.length; i++) {
            menuElements[i].style.display = "none";
        }
    }
}

////long horizontal list
//var rootHeader = prevHeader = new TreeHeader("root header");
//for (let i = 0; i < 15; i++) {
//    var h = new TreeHeader("header " + i);
//    var item = new TreeItem("item " + i, h);
//    var item1 = new TreeItem("item " + i, h);
//    var item2= new TreeItem("item " + i, h);
//    var item3= new TreeItem("item " + i, h);
//    var item4= new TreeItem("item " + i, h);
//    //item.onClick(function (event) { 
//    //    console.log("item " + i + " clicked");
//    //});
//    h.append(item);
//    h.append(item1);
//    h.append(item2);
//    h.append(item3);
//    h.append(item4);
//    if (prevHeader) {
//        prevHeader.append(h);
//    }
//    prevHeader = h;
//}
//tree.append(rootHeader);
//
////long vertical list
//for (let i = 0; i < 100; i++) {
//    let headerX = new TreeHeader("Header X " + i);
//    headerX.onClick(function (event) {
//        console.log(headerX.text + " clicked");
//        event.stopPropagation();
//    });
//    tree.append(headerX);
//}


//const Sidebar = require("./sidebar.js");
//const ContextMenu = require("./context-menu.js");
//const Svg = require("./svg-context.js");
//
//var mainContainer = document.createElement("div");
//mainContainer.className     = "main-container";
//mainContainer.id            = "default-main-container";
//
//var sidebar = new Sidebar();
//sidebar.menu = new ContextMenu();
//
//mainContainer.appendChild(sidebar.container);

////Sidebar menu items
//var item1 = sidebar.menu.newItem("add svg");
//item1.onclick = function () { 
//    var svg = initSvg();
//
//    var newBtn = sidebar.newButton();
//    newBtn.context = svg;
//
//    sidebar.addButton(newBtn);
//
//    if (sidebar.menu.isVisible()) {
//        sidebar.menu.hide();
//    }
//};
//sidebar.menu.addItem(item1);
//sidebar.buttons["add"].onclick = function () {
//    var x = sidebar.buttons["add"].getBoundingClientRect().right,
//        y = sidebar.buttons["add"].getBoundingClientRect().top;
//
//    sidebar.menu.show(x, y); //open option menu
//}
//
//document.body.onmousedown = function (event) {
//    var ele = document.elementFromPoint(event.clientX, event.clientY);
//    if ( !(ele.classList.contains("menu-item") || ele.classList.contains("menu")) ) {
//        if (sidebar.menu.isVisible()) {
//            sidebar.menu.hide();
//        }
//        for (var btn in sidebar.buttons) {
//            if (sidebar.buttons.hasOwnProperty(btn) && sidebar.buttons[btn].context) { 
//                var menu = sidebar.buttons[btn].context.menu;
//                if(menu.isVisible())
//                    menu.hide();
//            }
//        }
//    }
//}
//
//document.body.appendChild(mainContainer);
//
//const Shape = require("./shapes.js");
//
//function initSvg() {
//    var svg = new Svg();
//    var svgMenu = new ContextMenu();
//
//    var circleOption = svgMenu.newItem("new circle");
//    circleOption.onclick = function (event) { //TODO put creation at right click point
//        var circle = new Shape();
//        circle.shape = circle.Enum.CIRCLE;
//        circle.ele = circle.newShape(event.clientX, event.clientY);
//        circle.parent = svg.group;
//        circle.dragAttached = false;
//        circle.dragHelper = null;
//        circle.attachDragListener = function () {
//            //circle.ele.addEventListener("mousemove", context.dragHelper = function (event) { //reference to function so we can remove later
//            //    circle.translatePos(event.clientX, event.clientY);
//            //});
//            svg.container.onmousemove = function (event) { 
//                console.log("mouse move");
//                circle.translatePos(event.clientX, event.clientY);
//            };
//        };
//        circle.ele.onmousedown = function (event) {
//            console.log("mouse down");
//            circle.x = event.clientX;
//            circle.y = event.clientY;
//            if (!circle.dragAttached) {
//                console.log("drag attached");
//                circle.attachDragListener();
//                circle.dragAttached = true;
//            }
//            event.preventDefault();
//            event.stopPropagation();
//        };
//        circle.ele.onmouseup = function (event) { 
//            console.log("mouseup");
//            if (circle.dragAttached) {
//                //circle.ele.removeEventListener("mousemove", svgContainer.dragHelper);
//                //circle.ele.onmousemove = null;
//                console.log("drag removed");
//                svg.container.onmousemove = null;
//                circle.dragAttached = false;
//            }
//            event.stopPropagation();
//        };
//
//        svg.group.appendChild(circle.ele);
//        svgMenu.hide();
//    };
//
//    svgMenu.addItem(circleOption);
//
//    svg.menu = svgMenu;
//
//    svg.box.oncontextmenu = function (event) {
//        svg.menu.show(event.clientX, event.clientY);
//    };
//    
//    return svg;
//}
//
//function translatePos(destX, destY) 
//{
//    let element = this;
//
//    let dx = destX - mousedownPos.x,
//        dy = destY - mousedownPos.y;
//
//    let matrix = getMatrix(element, "transform"),
//        matrix2 = getMatrix(svgMap, "transform");
//
//    // Translation
//    // Scale down/up translation distance for zoom
//    if (element == svgMap) {
//        dx += matrix[4], dy += matrix[5];
//        //document.getElementById("svg-main-container")
//    }
//    else
//        dx = matrix[4] + dx/matrix2[0], dy = matrix[5] + dy/matrix2[3];
//
//    let matrixValue = `matrix(${matrix[0]} ${matrix[1]} ${matrix[2]} ${matrix[3]} ${dx} ${dy})`;
//
//    element.setAttribute("transform", matrixValue); 
//    setMousedownPos(destX, destY);
//}
//
