"use strict";

const baseAPI = env.URL || `http://127.0.0.1:${env.PORT}`;
const sketchAPI = `${baseAPI}/sketch`;
const modelAPI = `${baseAPI}/model`;
const jpgImageType = "image/jpeg",
  pngImageType = "image/png";
const canvasW = 500; //770;
const canvasH = 500; //400;

var currentAPI = modelAPI;

function clear() {
  const canvas = $("#canvas")[0];
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setupCanvas() {
  //setup canvas
  const canvasDiv = $("#canvasDiv");
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  const clearButton = document.querySelector("#clear");

  let lineWidth = 2;
  let color = "#000";

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
  var mousePos = { x: 0, y: 0 };
  var lastPos = mousePos;
  canvas.addEventListener(
    "mousedown",
    function(e) {
      drawing = true;
      lastPos = getMousePos(canvas, e);
    },
    false
  );
  canvas.addEventListener(
    "mouseup",
    function(e) {
      drawing = false;
    },
    false
  );
  canvas.addEventListener(
    "mousemove",
    function(e) {
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
    function(e) {
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
    function(e) {
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );
  canvas.addEventListener(
    "touchmove",
    function(e) {
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

function saveCanvasImage() {
  const canvas = document.querySelector("#canvas");
  // save canvas image as data url (png format by default)
  var dataURL = canvas.toDataURL(jpgImageType, 0.8);
  $("#resultImg").show();
  $("#resultImg").attr({ src: dataURL, width: canvasW, height: canvasH });
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
  clear();
  $("#selectImage").hide();
  $("#results").show();
}

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

function uploadToServer(image, url) {
  $("#loader").show();
  var base64ImageContent = image.replace(
    /^data:image\/(png|jpg|jpeg);base64,/,
    ""
  );
  var bytesArray = base64ToArrayBuffer(base64ImageContent);

  $.ajax({
    url: url,
    type: "POST",
    cache: false,
    contentType: "application/octet-stream",
    data: bytesArray,
    processData: false,
    success: function(data) {
      $("#loader").hide();
      showImages(data);
      // alert('Image Generation Successful');
    },
    error: function() {
      $("#loader").hide();
      alert(
        "Error uploading image. Please verify that the image is valid and less than 10MB."
      );
    }
  });
}

function getBase64Image(file, cb) {
  // Create an empty canvas element
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL(jpgImageType, 0.8);
    cb(dataURL);
    // uploadToServer(dataURL, currentAPI);
  };
  img.src = URL.createObjectURL(file);
}

function modelUpload(dataURL) {
  uploadToServer(dataURL, modelAPI);
}

function sketchUpload(dataURL) {
  uploadToServer(dataURL, sketchAPI);
}

$(document).ready(function() {
  const sketchBtnHtml = $("#sketchBtn").html();
  const canvasDiv = $("#canvasDiv");
  const imageDiv = $("#imageDiv");
  const sketchBtn = $("#sketchBtn");
  const uploadFileId = $("#uploadFileId");
  const uploadSketchId = $("#uploadSketchId");
  const useSketchBtn = $("#useSketchBtn");
  const useWebcamImageBtn = $("#useWebcamImageBtn");
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

  if (
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) ||
    navigator.getMedia === undefined
  ) {
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

  sketchBtn.on("click", function() {
    // showResults();
    console.log(sketchBtn.text());
    if (sketchBtn.text() != "Go Home") {
      toggleCanvas();
    } else {
      toggleHome();
    }
  });

  webcamBtn.on("click", function() {
    if (sketchBtn.text() != "Go Home") {
      toggleWebcam();
      var video = document.getElementById("video");
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then(function(stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();

            useWebcamImageBtn.on("click", function() {
              video.pause();
              var vidCanvas = document.createElement("canvas");
              vidCanvas.width = video.videoWidth;
              vidCanvas.height = video.videoHeight;
              vidCanvas.getContext("2d").drawImage(video, 0, 0);
              uploadToServer(
                vidCanvas.toDataURL(jpgImageType, 0.8),
                currentAPI
              );
              setTimeout(function() {
                video.play();
              }, 5000);
            });
          })
          .catch(error => {
            console.log("ERROR ACCESSING VIDEO CAMERA: ");
            console.log(error);
            alert(
              "Either (1) a webcam is not available on this device or (2) you're using chrome and http. If 2, then visit https://sketchme.azurewebsites.net/"
            );
          });
      }
    } else {
      toggleHome();
    }
  });

  useSketchBtn.on("click", function() {
    uploadToServer(canvas.toDataURL(jpgImageType, 0.8), currentAPI);
  });

  uploadImageBtn.on("change", function() {
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

  tryAgainBtn.on("click", function() {
    selectImageArea.show();
    resultsArea.hide();
  });
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
