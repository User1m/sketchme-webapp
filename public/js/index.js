"use strict";

var index = 0;
var query = document.getElementsByClassName("image-cycle");

function changeBanner() {
    for (var item of query) {
        [].forEach.call(
            item.children,
            function (v, i) {
                item.children[i].hidden = i !== index
            }
        );
        index = (index + 1) % item.children.length;
    }
}

window.onload = function () {
    setInterval(changeBanner, 1000)
};