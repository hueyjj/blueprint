window.onload = function () {
    var text = document.getElementById("text");
    var text2 = document.getElementById("text2");
    var submit = document.getElementById("submit");

    submit.addEventListener("click", function () {
        //console.log(text.value);
        //console.log(text2.value);
    });

    //var dialog = document.getElementsByClassName("dialog-container")[0];
    //dialog.style.visibility = "visible";
    let show = false;
    var dialog = document.getElementsByClassName("dialog-container")[0];
    document.getElementById("click-me").addEventListener("click", function () {
        if (show)
            dialog.style.visibility = "hidden";
        else
            dialog.style.visibility = "visible";

        show = show ? false : true;
    });

    document.getElementsByClassName("close-button")[0].addEventListener("click", function () {
        dialog.style.visibility = "hidden";
    });
};

