"use strict";

// var index = 0;
// var query = document.getElementsByClassName("image-cycle");

// function changeBanner() {
//     for (var item of query) {
//         [].forEach.call(
//             item.children,
//             function (v, i) {
//                 item.children[i].hidden = i !== index
//             }
//         );
//         index = (index + 1) % item.children.length;
//     }
// }

// window.onload = setupCanvas();

function setupCanvas() {
    //setup canvas
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext('2d');
    const clearButton = document.querySelector('#clear');

    let isDrawing = false;
    let lineWidth = 10;
    let color = "#000";
    let lastX = 0;
    let lastY = 0;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = lineWidth;
    ctx.globalCompositeOperation = "normal";
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    function draw(e) {
        if (!isDrawing) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();

        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    clearButton.addEventListener('click', clear);
}

$(document).ready(function () {

    //setup toggle
    const canvasDiv = $("#canvasDiv");
    const imagesDiv = $("#imageDiv");

    canvasDiv.hide();

    function toggleCanvas() {
        if (canvasDiv.is(":hidden") && imagesDiv.is(":visible")) {
            imagesDiv.hide();
            canvasDiv.show();
        } else {
            canvasDiv.hide();
            imagesDiv.show();
        }
    }

    $("#sketchBtn").on("click", toggleCanvas);

    setupCanvas();
});
