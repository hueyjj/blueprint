function Svg() {
    container: null;
    box: null;
    group: null;

}


Svg.prototype.container = document.createElement("div");
Svg.prototype.container.className   = "svg-container";
Svg.prototype.container.id          = "svg-main-container";

Svg.prototype.box = document.createElement("svg"),
Svg.prototype.box.className     = "svg-box";
Svg.prototype.box.id            = "svg-main-box";

Svg.prototype.group = document.createElement("g");
Svg.prototype.group.className   = "svg-group";
Svg.prototype.group.id          = "svg-main-group";

Svg.prototype.box.appendChild(Svg.prototype.group);
Svg.prototype.container.appendChild(Svg.prototype.box);

module.exports = Svg;
