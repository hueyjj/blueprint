class Menu {
    constructor(items) {
        this.element = document.createElement("div");
        this.element.classList = "menu menu-container";

        this.list = document.createElement("ul");
        this.list.classList = "menu-list";

        this.element.appendChild(this.list);

        if (items) {
            //console.log(items);
            //console.log(items.length);
            for (let i = 0; i < items.length; i++) {
                //console.log(items[i].name);
                //console.log(items[i].fn);
                this.append(items[i].name, items[i].fn);
            }
        }
    }

    append(text, fn) {
        var item = document.createElement("li");
        item.classList = "menu-item";
        item.onclick = fn;

        var span = document.createElement("span");
        span.classList.add("menu-text");
        span.textContent = text;

        item.appendChild(span);
        this.list.appendChild(item);
    }

    move(x, y) {
        this.element.style.left = x + "px";
        this.element.style.top = y + "px";
    }
    
    hide() {
        this.element.style.display = "none";
    }

    show() {
        this.element.style.display = "inline-block";
    }
}

if (typeof module !== "undefined") 
    module.exports = Menu;
