"use strict";

const baseAPI = "https://91448817.ngrok.io";
const sketchAPI = `${baseAPI}/sketch`;
const modelAPI = `${baseAPI}/model`;
const imageType = "image/jpeg";
const canvasW = 400;//770;
const canvasH = 400;//400;

var currentAPI = modelAPI;

function clear() {
    const canvas = $('#canvas')[0];
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setupCanvas() {
    //setup canvas
    const canvas = document.querySelector("#canvas");
    const ctx = canvas.getContext('2d');
    const clearButton = document.querySelector('#clear');

    let isDrawing = false;
    let lineWidth = 2;
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
    var dataURL = canvas.toDataURL(imageType, 0.8);
    $("#canvasImg").show();
    $('#canvasImg').attr({ "src": dataURL, "width": canvasW, "height": canvasH });
}

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function showResults() {
    $("#selectImage").hide();
    $("#results").show();
}

function showImages(data) {
    showResults();
    var datas = data.split(",");
    $("#sketchImg").attr('src', 'data:image/jpg;base64,' + datas[0]);
    $("#canvasImg").attr('src', 'data:image/jpg;base64,' + datas[1]);
}

function uploadToServer(image, url) {
    $("#loader").show();
    var base64ImageContent = image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
    var bytesArray = base64ToArrayBuffer(base64ImageContent);

    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        contentType: 'application/octet-stream',
        data: bytesArray,
        processData: false,
        success: function (data) {
            $("#loader").hide();
            showImages(data);
            // alert('Image Generation Successful');
        },
        error: function () {
            $("#loader").hide();
            alert('Error Uploading File');
        }
    });
}

function getBase64Image(file) {
    // Create an empty canvas element
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(imageType, 0.8);
        uploadToServer(dataURL, currentAPI);
    };
    img.src = URL.createObjectURL(file);
}

$(document).ready(function () {
    const sketchBtnHtml = $("#sketchBtn").html();
    const canvasDiv = $("#canvasDiv");
    const imageDiv = $("#imageDiv");
    const sketchBtn = $("#sketchBtn");
    const uploadFileId = $("#uploadFileId");
    const saveBtn = $("#saveBtn");
    const uploadBtn = $("#uploadImageBtn");
    const canvas = $("#canvas")[0];
    const canvasImg = $("#canvasImg");
    const tryAgainBtn = $("#tryAgainBtn");
    const resultsArea = $("#results");
    const selectImageArea = $('#selectImage');

    function toggleCanvas() {
        clear();
        if (canvasDiv.is(":hidden") && imageDiv.is(":visible")) {
            imageDiv.hide();
            canvasDiv.show();
            sketchBtn.text("Go Back");
            uploadFileId.hide();
        } else {
            canvasDiv.hide();
            imageDiv.show();
            sketchBtn.html(sketchBtnHtml);
            uploadFileId.show();
        }
    }

    canvasDiv.hide();
    $("#loader").hide();

    setupCanvas();

    sketchBtn.on("click", function () {
        // showResults();
        toggleCanvas();
    });
    saveBtn.on("click", function () {
        uploadToServer(canvas.toDataURL(imageType, 0.8), currentAPI);
    });
    uploadBtn.on("change", function () {
        var imageFile = uploadBtn.get(0).files[0];
        // console.log(imageData.type);
        var src = window.URL.createObjectURL(imageFile);
        canvasImg.show();
        canvasImg.attr({ "src": src });
        getBase64Image(imageFile);
    });
    tryAgainBtn.on('click', function () {
        selectImageArea.show();
        resultsArea.hide();
    });

    document.body.addEventListener("touchstart", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchend", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener("touchmove", function (e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    }, false);

    // Set up touch events for mobile, etc
    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);

    canvas.addEventListener("touchmove", function (e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }
});








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