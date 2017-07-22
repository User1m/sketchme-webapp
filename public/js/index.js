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

// window.onload = function () {
//     setInterval(changeBanner, 1000)
// };

//setup canvas
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.querySelector('#clear');

let isDrawing = false;
let lineWidth = 1;
let color = "#fff";
let lastX = 0;
let lastY = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.strokeStyle = color;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = lineWidth;
ctx.globalCompositeOperation = "normal";

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
}

clearButton.addEventListener('click', clear);