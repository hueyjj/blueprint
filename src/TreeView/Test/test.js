document.addEventListener("DOMContentLoaded", function () {
    var tree = new TreeView();
    var header = new TreeHeader("HeaderOne"),
        header2 = new TreeHeader("HeaderTwo");
    var item = new TreeItem("ItemOne", header),
        item2 = new TreeItem("ItemTwo", header2);
    item.onClick(function (e) {
        console.log("before change: " + item.getText() + " clicked");
        item.setText("different text");
        console.log("after change: " + item.getText() + " clicked");
        e.stopPropagation();
    });
    item2.onClick(function (e) {
        console.log("before change: " + item2.getText() + " clicked");
        item2.setText("different text");
        console.log("after change: " + item2.getText() + " clicked");
        e.stopPropagation();
    });
    header.onClick(function (e) {
        console.log(header.text + " clicked");
        e.stopPropagation();
    });
    header2.onClick(function (e) {
        console.log(header2.text + " clicked");
        e.stopPropagation();
    });
    tree.onClick(function (e) {
        console.log("tree clicked");
        e.stopPropagation();
    });

    //console.log("-----initialize");
    //console.log(tree);
    //console.log(header);
    //console.log(item);

    header.append(item);
    header2.append(item2);
    header.append(header2);
    tree.append(header);

    //console.log("-----testing append");
    //console.log(tree);
    //console.log(tree.element);

    document.body.appendChild(tree.element);

    //long horizontal list
    var rootHeader = prevHeader = new TreeHeader("root header");
    for (let i = 0; i < 15; i++) {
        let h = new TreeHeader("header " + i);
        let item = new TreeItem("item " + i, h);
        let item1 = new TreeItem("item " + i, h);
        let item2= new TreeItem("item " + i, h);
        let item3= new TreeItem("item " + i, h);
        let item4= new TreeItem("item " + i, h);
        //item.onClick(function (e) { 
        //    console.log("item " + i + " clicked");
        //});
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
        headerX.onClick(function (e) {
            console.log(headerX.text + " clicked");
            e.stopPropagation();
        });
        tree.append(headerX);
    }


});
