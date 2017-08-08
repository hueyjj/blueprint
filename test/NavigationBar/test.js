const NavigationBar = require("../../src/NavigationBar/NavigationBar.js");
const NavigationSubList = require("../../src/NavigationBar/NavigationSubList.js");
const NavigationItem = require("../../src/NavigationBar/NavigationItem.js");

document.addEventListener("DOMContentLoaded", function () {
    var navBar = new NavigationBar();
    var sublist = new NavigationSubList("HeaderOne"),
        sublist2 = new NavigationSubList("HeaderTwo");
    var item = new NavigationItem("ItemOne", sublist),
        item2 = new NavigationItem("ItemTwo", sublist2);
    item.onClick(function (e) {
        //console.log("before change: " + item.getText() + " clicked");
        //item.setText("different text");
        //console.log("after change: " + item.getText() + " clicked");
        e.stopPropagation();
    });
    item2.onClick(function (e) {
        //console.log("before change: " + item2.getText() + " clicked");
        //item2.setText("different text");
        //console.log("after change: " + item2.getText() + " clicked");
        e.stopPropagation();
    });
    sublist.onClick(function (e) {
        console.log(sublist.text + " clicked");
        e.stopPropagation();
    });
    sublist2.onClick(function (e) {
        console.log(sublist2.text + " clicked");
        e.stopPropagation();
    });
    navBar.onClick(function (e) {
        console.log("navBar clicked");
        e.stopPropagation();
    });

    //console.log("-----initialize");
    //console.log(navBar);
    //console.log(sublist);
    //console.log(item);

    sublist2.append(item2);
    sublist.append(sublist2);
    sublist.append(item);
    navBar.append(sublist);

    //console.log("-----testing append");
    //console.log(navBar);
    //console.log(navBar.element);

    document.body.appendChild(navBar.element);

    //long horizontal list
    
    var rootHeader = prevHeader = new NavigationSubList("root sublist");
    for (let i = 0; i < 15; i++) {
        let h = new NavigationSubList("l" + i);
        let item = new NavigationItem("item " + i, h);
        let item1 = new NavigationItem("item " + i, h);
        let item2= new NavigationItem("item " + i, h);
        let item3= new NavigationItem("item " + i, h);
        let item4= new NavigationItem("item " + i, h);
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
    navBar.append(rootHeader);

    //long vertical list
    for (let i = 0; i < 100; i++) {
        let sublistX = new NavigationSubList("Header X " + i);
        sublistX.onClick(function (e) {
            console.log(sublistX.text + " clicked");
            e.stopPropagation();
        });
        navBar.append(sublistX);
    }
});
