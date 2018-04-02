"use strict";

const baseAPI = env.baseAPI,
  sketchAPI = `${baseAPI}/sketch`,
  modelAPI = `${baseAPI}/model`,
  jpgImageType = "image/jpeg",
  pngImageType = "image/png",
  canvasW = 500, //770;
  canvasH = 500; //400;

var video;
var currentAPI = modelAPI;
var isVideo = false;

/**
 * clear drawing canvas
 */
function clear() {
  const canvas = $("#canvas")[0];
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}


/**
 * Functions for drawing on canvas
 */
function setupCanvas() {
  //setup canvas
  const canvasDiv = $("#canvasDiv"),
    canvas = document.querySelector("#canvas"),
    ctx = canvas.getContext("2d"),
    clearButton = document.querySelector("#clear"),
    lineWidth = 2,
    color = "#000";

  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = lineWidth;
  ctx.globalCompositeOperation = "normal";
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  ) {
    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerWidth - 50;
  } else {
    canvas.width = canvasW;
    canvas.height = canvasH;
  }

  clearButton.addEventListener("click", clear);

  // Set up mouse events for drawing
  var drawing = false;
  var mousePos = {
    x: 0,
    y: 0
  };
  var lastPos = mousePos;
  canvas.addEventListener(
    "mousedown",
    function (e) {
      drawing = true;
      lastPos = getMousePos(canvas, e);
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    function (e) {
      drawing = false;
    },
    false
  );
  canvas.addEventListener(
    "mousemove",
    function (e) {
      mousePos = getMousePos(canvas, e);
      renderCanvas();
    },
    false
  );

  // Get the position of the mouse relative to the canvas
  function getMousePos(canvasDom, mouseEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top
    };
  }

  // Draw to the canvas
  function renderCanvas() {
    if (drawing) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      lastPos = mousePos;
    }
  }

  // Set up touch events for mobile, etc
  canvas.addEventListener(
    "touchstart",
    function (e) {
      mousePos = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );
  canvas.addEventListener(
    "touchend",
    function (e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );
  canvas.addEventListener(
    "touchmove",
    function (e) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );

  // Get the position of a touch relative to the canvas
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }

  // function resizeCanvas() {
  //     canvas.width =
  //         canvas.height = $("#canvasDiv").width();
  // }
  // window.addEventListener('resize', resizeCanvas, false);
  // window.addEventListener('orientationchange', resizeCanvas, false);
}


/**
 *  save canvas image as data url to jpg (png format by default)
 */
function saveCanvasImage() {
  const canvas = document.querySelector("#canvas");
  var dataURL = canvas.toDataURL(jpgImageType, 0.8);
  $("#resultImg").show();
  $("#resultImg").attr({
    src: dataURL,
    width: canvasW,
    height: canvasH
  });
}


/**
 * Turn image to bytes array
 */
function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}


/**
 * Update UI once backend has responded
 */
function showResults() {
  clear();
  $("#selectImage").hide();
  $("#results").show();
}

/**
 * Update UI once backend has responded
 */
function showImages(data) {
  showResults();
  var splitData = data.split(",");
  if (splitData[0]) {
    $("#sketchImg").attr("src", "data:image/jpg;base64," + splitData[0]);
  }
  if (splitData[1]) {
    $("#resultImg").attr("src", "data:image/jpg;base64," + splitData[1]);
  }
  if (splitData[2]) {
    $("#originalImg").attr("src", "data:image/jpg;base64," + splitData[2]);
  }
}

/**
 * Upload image bytes array to server
 */
function uploadToServer(image, url) {
  $("#loader").show();
  var base64ImageContent = image.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
  var bytesArray = base64ToArrayBuffer(base64ImageContent);

  $.ajax({
    url: url,
    type: "POST",
    crossDomain: true,
    cache: false,
    contentType: "application/octet-stream",
    data: bytesArray,
    processData: false,
    success: function (data) {
      $("#loader").hide();
      showImages(data);
      // alert('Image Generation Successful');
    },
    error: function () {
      $("#loader").hide();
      alert(
        // `Error: Please make to enable "Load unsafe scripts".\nTo learn how go here: bit.ly/load-unsafe-scripts`
        "Error uploading image. Please verify that the image is valid and less than 10MB."
      );
    },
    complete: () => {
      if (isVideo) {
        video.play();
      }
    }
  });
}

/**
 * Image to base64 string
 */
function getBase64Image(file, cb) {
  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(jpgImageType, 0.8);
    cb(dataURL);
  };
  img.src = URL.createObjectURL(file);
}

function modelUpload(dataURL) {
  uploadToServer(dataURL, modelAPI);
}

function sketchUpload(dataURL) {
  uploadToServer(dataURL, sketchAPI);
}

/**
 * Main Code
 */

$(document).ready(function () {
  const sketchBtnHtml = $("#sketchBtn").html();
  const canvasDiv = $("#canvasDiv");
  const imageDiv = $("#imageDiv");
  const sketchBtn = $("#sketchBtn");
  const uploadFileId = $("#uploadFileId");
  const uploadSketchId = $("#uploadSketchId");
  const useSketchBtn = $("#useSketchBtn");
  const useWebcamImageBtn = $("#useWebcamImageBtn");
  const homeImageBtn = $("#homeImageBtn");
  const uploadImageBtn = $("#uploadImageBtn");
  const canvas = $("#canvas")[0];
  const tryAgainBtn = $("#tryAgainBtn");
  const resultsArea = $("#results");
  const selectImageArea = $("#selectImage");
  // const uploadSketchBtn = $("#uploadSketchBtn");
  const videoDiv = $("#videoDiv");
  const webcamBtn = $("#webcamBtn");

  navigator.getMedia =
    navigator.mediaDevices.getUserMedia ||
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

  /* Setup */
  canvasDiv.hide();
  videoDiv.hide();
  $("#loader").hide();
  setupCanvas();

  //hide webcam btn on mobile
  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || navigator.getMedia === undefined) {
    webcamBtn.hide();
  }

  function toggleCanvas() {
    clear();
    videoDiv.hide();
    imageDiv.hide();
    canvasDiv.show();
    sketchBtn.text("Go Home");
    uploadFileId.hide();
    uploadSketchId.hide();
    webcamBtn.hide();
  }

  function toggleHome() {
    clear();
    videoDiv.hide();
    canvasDiv.hide();
    imageDiv.show();
    sketchBtn.html(sketchBtnHtml);
    uploadFileId.show();
    uploadSketchId.show();
    webcamBtn.show();
  }

  function toggleWebcam() {
    clear();
    videoDiv.show();
    imageDiv.hide();
    canvasDiv.hide();
    sketchBtn.text("Go Home");
    uploadFileId.hide();
    uploadSketchId.hide();
    webcamBtn.hide();
  }

  sketchBtn.on("click", function () {
    // showResults();
    console.log(sketchBtn.text());
    if (sketchBtn.text() != "Go Home") {
      toggleCanvas();
    } else {
      toggleHome();
    }
  });

  webcamBtn.on("click", function () {
    if (sketchBtn.text() != "Go Home") {
      isVideo = true;
      toggleWebcam();
      video = document.getElementById("video");
      navigator.mediaDevices
        .getUserMedia({
          video: true
        })
        .then(function (stream) {
          video.src = window.URL.createObjectURL(stream);
          video.play();

          useWebcamImageBtn.on("click", function () {
            video.pause();
            var vidCanvas = document.createElement("canvas");
            vidCanvas.width = video.videoWidth;
            vidCanvas.height = video.videoHeight;
            vidCanvas.getContext("2d").drawImage(video, 0, 0);
            uploadToServer(vidCanvas.toDataURL(jpgImageType, 0.8), currentAPI);
          });

          homeImageBtn.on("click", function () {
            toggleHome();
          });
        })
        .catch(error => {
          console.log("ERROR ACCESSING VIDEO CAMERA: ");
          console.log(error);
          alert(
            "Either (1) a webcam is not available on this device or (2) you're using the http:// url. If 2, then visit the https:// version of this url."
          );
        });
    } else {
      toggleHome();
    }
  });

  useSketchBtn.on("click", function () {
    uploadToServer(canvas.toDataURL(jpgImageType, 0.8), currentAPI);
  });

  uploadImageBtn.on("change", function () {
    isVideo = false;
    var imageFile = uploadImageBtn.get(0).files[0];
    getBase64Image(imageFile, modelUpload);
    // console.log(imageData.type);
    // var src = window.URL.createObjectURL(imageFile);
    // resultImg.show();
    // resultImg.attr({ "src": src });
  });

  // uploadSketchBtn.on("change", function() {
  //   var imageFile = uploadImageBtn.get(0).files[0];
  //   getBase64Image(imageFile, sketchUpload);
  // });

  tryAgainBtn.on("click", function () {
    selectImageArea.show();
    resultsArea.hide();
  });
});