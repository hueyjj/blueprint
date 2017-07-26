function Svg() {
    this.container = document.createElement("div");
    this.container.className   = "svg-container sub-container";
    this.container.id          = "svg-main-container";

    this.box = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.box.setAttribute("class", "svg-box");
    this.box.setAttribute("id", "svg-main-box");

    this.group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.group.setAttribute("class", "svg-group");
    this.group.setAttribute("id", "svg-main-group");
    this.group.setAttribute("transform", "matrix(1 0 0 1 0 0)");

    this.box.appendChild(this.group);
    this.container.appendChild(this.box);

    menu: null;
}

module.exports = Svg;
