function Sidebar() {
    container: null;
    list: null;
    buttons: null;
    
    menu: null;
    
    newButton: null;
    add: null;
    update: null;
}

Sidebar.prototype.container             = document.createElement("div");
Sidebar.prototype.container.className   = "sidebar";
Sidebar.prototype.container.id          = "default-sidebar";

Sidebar.prototype.list              = document.createElement("ul");
Sidebar.prototype.list.className    = "sidebar-list";
Sidebar.prototype.list.id           = "default-sidebar-list";

//NOTE: maybe hindering with a non-empty sidebar. i.e always has an add-button
//default add button
var addBtn = document.createElement("li");
addBtn.id           = "add-button";
addBtn.title        = "add";
addBtn.className    = "list-item list-button";
addBtn.role         = "button";

Sidebar.prototype.buttons = {}; //keep track of button ordering
Sidebar.prototype.buttons["add"] = addBtn;

Sidebar.prototype.list.appendChild(addBtn);
Sidebar.prototype.container.appendChild(Sidebar.prototype.list);

Sidebar.prototype.newButton = function (attr) {
    var that = this;

    var btn = document.createElement("li");
    btn.className = "list-item list-button user-button";
    btn.role = "button";

    if (attr != undefined) {
        for (var attribute in attr) {
            btn.setAttribute(attribute, attr[attribute]);
        }
    } 
    else {
        var user = "user-button-",
            value = 0;

        while(this.buttons.hasOwnProperty("userButton" + value))
            value++;

        btn.id = user + value;
        btn.title = "No title given";
    }
    
    btn.context = null; //holds reference to a context object e.g svg object 

    btn.onclick = function () { 
        //wipe current context
        var context = document.getElementsByClassName("sub-container");
        for (var i = 0; i < context.length; i++) {
            context[i].classList.remove("current-context");
        }
        for (var i = 0; i < context.length; i++) {
            document.getElementById("default-main-container").removeChild(context[i]);
        }

        //TODO fix hover and active state of the buttons
        //set current context
        if (this.context.container) {
            this.context.container.classList.add("current-context");
            document.getElementById("default-main-container").appendChild(this.context.container);
           
            //turn off other buttons 
            for (var b in that.buttons) {
                that.buttons[b].style.backgroundColor = "transparent";
            }
            btn.style.backgroundColor = "lightgrey";
        }
    }

    return btn;
};

Sidebar.prototype.addButton = function (newBtn) {
    var user = "userButton",
        value = 0;

    while (this.buttons.hasOwnProperty(user + value)) 
        value++;

    this.buttons[user + value] = newBtn;
    
    this.update();
};

Sidebar.prototype.update = function () {
    while (this.list.firstChild) {
        this.list.removeChild(this.list.firstChild);
    }

    for (var btn in this.buttons) {
        if (btn != "add")
            this.list.appendChild(this.buttons[btn]);
    }
    this.list.appendChild(this.buttons["add"]); //add-button at end of list
}

module.exports = Sidebar;
