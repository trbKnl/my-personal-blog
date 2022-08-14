---
title: Efficient C++ code in the browser
date: 2022-9-20
description: C++ in the browser; a machine learning application of webassembly with emscripten
---

<figure style="display:inline-block;">
    <video style="outline-style:solid;" id="videoInput" width="175" height="131" alt="asdasdasasd"> </video>
    <figcaption>Video feed</figcaption>
</figure>
<figure style="display:inline-block;">
    <canvas style="outline-style:solid;" id="canvasFrame" width="175" height="131"></canvas>
    <figcaption>Frames to be processed</figcaption>
</figure>
<figure style="display:inline-block;">
    <canvas style="outline-style:solid;" id="canvasOutput" width="175" height="131"></canvas>
    <figcaption>Low dimensional image</figcaption>
</figure>



<div class="slidecontainer">
    <input type="range" min="0" max="20" value="0" class="slider" id="ncompSlider">
    <p>Numer of components: <span id="ncompDisplay"></span></p>
</div>
<input type="button" id="startBtn" value="Start">
<input type="button" id="stopBtn" value="Stop">


<script src="/opencv.js" type="text/javascript"></script>
<script src="/HelloWasm.js"></script>
<script>

const ncompSlider = document.querySelector("#ncompSlider")
const startBtn = document.querySelector("#startBtn")
const stopBtn = document.querySelector("#stopBtn")
const video = document.querySelector("#videoInput")
const ncompDisplay = document.querySelector("#ncompDisplay")
ncompDisplay.innerHTML = parseInt(ncompSlider.value) + 1

const worker = new Worker("/worker.js")

let canvasFrame = document.getElementById("canvasFrame"); // canvasFrame is the id of <canvas>
let context = canvasFrame.getContext("2d");
let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
let RUNNING = false

video.addEventListener("play", startFrameProcess)
video.addEventListener("pause", stopFrameProcess)
startBtn.addEventListener("click", startFrameProcess)
stopBtn.addEventListener("click", stopFrameProcess)
stopBtn.disabled = true;

ncompSlider.addEventListener("change", updateNcomp)

// Open video stream
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
.then(function(stream) {
    video.srcObject = stream;
})
.catch(function(err) {
    console.log("An error occurred! " + err);
});

async function startFrameProcess() {
    video.play()
    RUNNING = true
    let transferFrame = new Uint8Array(22925)
    startBtn.disabled = true
    stopBtn.disabled = false;

    while (RUNNING) {
        context.drawImage(video, 0, 0, video.width, video.height);
        src.data.set(context.getImageData(0, 0, video.width, video.height).data);
        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        
        transferFrame.set(dst.data)
        worker.postMessage({action: "start", transferFrame}, [transferFrame.buffer])
        transferFrame = await waitForFrameFromWorker()

        dst.data.set(transferFrame)
        cv.imshow("canvasOutput", dst); // canvasOutput is the id of another <canvas>;

    }
}
            
async function waitForFrameFromWorker() {
    return new Promise((resolve) => {
        worker.onmessage = (e) => {
            resolve(new Uint8Array(e.data.frame))
        }
    })
}

function stopFrameProcess() {
    video.pause()
    RUNNING = false
    worker.postMessage({action: "stop"})

    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function updateNcomp() {
    ncompDisplay.innerHTML = parseInt(ncompSlider.value) + 1
    worker.postMessage({action: "updateNcomp", ncomp: ncompSlider.value})
}

</script>

