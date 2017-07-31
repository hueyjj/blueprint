document.addEventListener("DOMContentLoaded", function () {
    var menu = new Menu();
    menu.append("print hello world", function (e) {
        console.log("hello world");
        e.stopPropagation();
    });
    menu.append("print superman", function (e) {
        console.log("superman");
        e.stopPropagation();
    });
    menu.append("print batman", function (e) {
        console.log("batman");
        e.stopPropagation();
    });
    menu.append("print tower", function (e) {
        console.log("tower");
        e.stopPropagation();
    });
    menu.append("print gator", function (e) {
        console.log("gator");
        e.stopPropagation();
    });
    menu.append("print super looooooong word", function (e) {
        console.log("super looooooong word");
        e.stopPropagation();
    });
    menu.element.style.left = "500px";
    menu.element.style.top = "300px";
    document.body.appendChild(menu.element);

    document.body.oncontextmenu = function (event) {
        menu.show();
        menu.move(event.clientX, event.clientY);
        event.preventDefault();
    };

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
});
