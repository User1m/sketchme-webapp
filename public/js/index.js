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
const canvasW = 770;
const canvasH = 400;

function clear() {
    const ctx = $('#canvas')[0].getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    $("#canvasImg").hide();
}

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

    canvas.width = canvasW; //window.innerWidth;
    canvas.height = canvasH;//window.innerHeight;

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

    clearButton.addEventListener('click', clear);
}

function saveCanvasImage() {
    const canvas = document.querySelector('#canvas');
    // save canvas image as data url (png format by default)
    var dataURL = canvas.toDataURL();
    // so it can be saved as an image
    $("#canvasImg").show();
    $('#canvasImg').attr({ "src": dataURL, "width": canvasW, "height": canvasH });
}

$(document).ready(function () {

    //setup toggle
    const canvasDiv = $("#canvasDiv");
    const imagesDiv = $("#imageDiv");
    const sketchBtn = $("#sketchBtn");
    const uploadFileId = $("#uploadFileId");
    const sketchBtnHtml = sketchBtn.html();

    canvasDiv.hide();

    function toggleCanvas() {
        if (canvasDiv.is(":hidden") && imagesDiv.is(":visible")) {
            imagesDiv.hide();
            canvasDiv.show();
            sketchBtn.text("Go Back");
            uploadFileId.hide();
        } else {
            clear();
            canvasDiv.hide();
            imagesDiv.show();
            sketchBtn.html(sketchBtnHtml)
            uploadFileId.show();
        }
    }

    $("#sketchBtn").on("click", toggleCanvas);
    $("#saveBtn").on("click", saveCanvasImage);

    setupCanvas();
});
