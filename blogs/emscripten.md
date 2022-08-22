---
title: Efficient C++ code in the browser, an image processing example
date: 2022-08-21
description: C++ in the browser with emscripten embind
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
<input type="button" id="stopBtn" value="Stop" disabled>

<h3 class="border-bottom mb-3 mt-5" id="">Eigen faces from video feed</h3>

The program above is a demonstration of a real time [eigenfaces](https://en.wikipedia.org/wiki/Eigenface) (if you put your face in front of the webcam). It takes as input a raw frame from the video feed, and sends back a low dimensional representation of that frame in black and white. The dimensions of the frame are reduced by using the singular value decomposition retaining only the `numer of components` that explain the most variance in the image data. For more information checkout my [blogpost on PCA](https://niekdeschipper.com/projects/pca.md).

This program is purely for fun and the images created look really cool and artistic. What I like to do with this program, is start at only one component, and than slowly increment the number of components. Its then very fun to see which details of the image are reconstructed by adding more components. The most fun is around one to four components. Then the details added become increasingly minor.

This program is run client side in the browser and is made with: 

* [emscripten](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html) to compile `C++` to webassembly
* `C++` with the library [Eigen](https://eigen.tuxfamily.org/index.php?title=Main_Page) a linear algebra library 
* JavaScript for the glue code, the UI and it provides functions the webassembly procedures 

I have not tested the code for browser compatibility so it might not work for your, but I hope so.


<h3 class="border-bottom mb-3 mt-5" id="">Goal of this blog post</h3>

The goal of this blog post is to show people what cool things you can do with emscripten and to show you a fun example of eigenfaces. [Emscripten](https://emscripten.org/) is a compiler that compiles C code to [Webassembly](https://webassembly.org/), an assembly language that can be run in modern browsers. This opens up really cool things, such as gaming in the browser, whole programs written in C or C++ run in the browser or this fun eigen face example. This blog post will give you some pointers on how to start compiling and using C++ code in the browser. Interesting problems that I had to solve were: 

* How to compile C++ to webassembly
* How to use webassembly efficiently
* How to send data back and forth between this page (displaying the video output) and webworker running the webassembly code. This is needed, so the main thread is free for the UI and viewing this page. I did not do this right before, and it was a huge huge performance bottleneck. And even after all optimizations I did, I still do not really think this is performant. I think I get on average 3-5 frames are processed per second on my machine and the image is not particularly big. But still, I think you could definitely implement pretty calculation heavy estimation procedures this way. And the great thing about this is that all of this happens client side: so, no sensitive data has to be send to a server, and you do not have to have a beefy server in place doing calculations for your users.

In this blog post I will discuss:

* The general approach I took to this problem, which I think is the most valuable part of this blog post so you can learn from from this approach and change it to your liking.
* How I compiled C++ to WASM, honestly this was mostly a lot of RTFM'ing, the documentation out there is pretty good! But it can be a lot. 
* The JavaScript code that glues all the parts together

The title is a bit clickbait, its not really that efficient, buts that's probably also partly my own fault and partly because webassembly is not as efficient as native `C++`. However, the possibilities with compiling code to wasm and then running it client side in the browser are huge for statistics and machine learning. I tried to make this programming using only JavaScript, and I could not find a nice linear algebra library with convenient data structures.

<h3 class="border-bottom mb-3 mt-5" id="">General architecture</h3>

The program works as follows:

1. The program captures the video feed from the webcam, and sends frames to a webworker, 
2. this webworker runs webassembly code that performs the image processing, 
3. if that's done the resulting frame is send back to the main thread, and it it shown on screen.
4. repeat

Here you can see the architecture in a graph:

<img src="/eigenfaces_program_arch.svg" width=800px>

The general development process went as follows:

At first I did not implement a webworker, I thought I did not need to! But then when testing, I noticed the page scrolling was really slow, and during the webassembly procedures, the UI would completely hang. Makes a lot of sense, I just didn't think about it beforehand. The hanging of the UI was unacceptable to me. In order to alleviate the UI, I implemented a [webworker](https://developer.mozilla.org/en-US/docs/Web/API/Worker) this webworker runs the image processing in a separate thread, so the main thread is free to respond to the user, scrolling and clicking and whatnot.

This presented a different problem, the webworker communicates with the main thread by sending messages back and forth using the webworker API. I this case the messages contain image data that need to be processed. I want the maximal number of frames per seconds possible, this means that a lot of bytes have to be send back and forth between the main thread and the worker thread. At first I send the image data using a message, which used the structured clone algorithm (whatever that is) to copy the data to the webwoker. This was very very slow. 

Luckily, there is a way to get data to the webworker that does not involve copying. You can transfer objects between the webworker and the main thread (see the webworker documentation). You can transfer the ownership of an ArrayBuffer (containing your image data) to the webworker, the object becomes unusable to the main thread, but it can now be used in the webworker thread. A stackoverflow post, I forget which one, suggested you could "ping pong" ArrayBuffers back and forth between the main and webworker thread (effectively preventing object copying), and that is what I implemented. This improved performance back to the original.

Another spot where I tried to optimize was the webassembly code. When running webassembly code in the browser, all the webassembly objects live on the webassembly heap. If you want to go back and forth between wasm and JavaScript it also involves object copying! A huge bummer. But, [emscripten bind](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html), provides memory views from C++ to JavaScript using `typed_memory_data`, so you can directly access memory on the webassembly heap from JavaScript. It surprised me how easily I got it to work, `thanks to emscripten bind`


<h3 class="border-bottom mb-3 mt-5" id="">Emscripten: embind</h3>

With emscripten you can compile C and C++ to webassembly, for this project I chose emscripten embind, from their website: "Embind is used to bind C++ functions and classes to JavaScript, so that the compiled code can be used in a natural way by “normal” JavaScript." No regrets, works like a charm. 

I compiled the project making use of [cmake](https://cmake.org/). I made use of these [instructions](https://gist.github.com/WesThorburn/00c47b267a0e8c8431e06b14997778e4) I found. I don't think I followed them completely, but it was enough to get me started. I setup my project folder as follows:

My project folder was setup as follows:

```
├── build
├── CMakeLists.txt      # contains the instructions from cmake on how to build
├── eigen-3.4.0         # I downloaded the cpp eigen library and put it in this folder
├── README              # contains crypted instructions for myself
└── src
    └── main.cpp        # contains the main program, which can be found below
```

My README contains the following content: 

```
In order to make it work follow:

https://gist.github.com/WesThorburn/00c47b267a0e8c8431e06b14997778e4

CMAKE_TOOLCHAIN_FILE=/usr/lib/emscripten/cmake/Modules/Platform/Emscripten.cmake
cd build
emcmake cmake ..
```

I put the commands there in order to make it work. Because I always forget the exact commands, its great to have them somewhere, I also put links to resources I used, so I can always reconstruct what I did at a later time.

These are the contents of my `CMakeLists.txt`: 

```cmake
cmake_minimum_required(VERSION 3.0)

project(HelloWasm)

# include files
include_directories(./include .include/HelloWasm ./src)

# target
add_executable(HelloWasm ./src/main.cpp )
set_target_properties(HelloWasm PROPERTIES LINK_FLAGS "-s DISABLE_EXCEPTION_CATCHING=0 -s ASSERTIONS=0 -O3 -s ALLOW_MEMORY_GROWTH=1 --bind")

# 3rd party libs
include_directories("/path/to/this/particular/version/of/eigen-3.4.0/")
```

I did not really pay special attention to this, I don't even know if all the lines are necessary. The main thing this does for me is, making it so, that the compiler knows where the libraries are, it puts all generated files neatly in folders, and it handles the compiler flags for optimization. In order to know which compiler settings I needed, I read the emscripten bind documentation.

Below you can find the cpp code. I annotated it so you know what it does. In summary, it performs an SVD on a matrix and stores the result in another matrix, both matrices are made available to JavaScript, using `typed_memory_view`.

```cpp
#include <iostream>
#include <cmath>
#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <Eigen/Dense>
#include <Eigen/SVD>

Eigen::MatrixXf init_input_matrix() {
    Eigen::MatrixXf in;
    in.resize(175, 131);
    in.setZero();
    return in;
}

Eigen::MatrixXf init_output_matrix() {
    Eigen::MatrixXf out;
    out.resize(175, 131);
    out.setZero();
    return out;
}

// Global matrices
Eigen::MatrixXf inm = init_input_matrix();
Eigen::MatrixXf outm = init_output_matrix();

// Function to give javascript access to global matrices
emscripten::val getInputMatrixBytes() {
    return emscripten::val(emscripten::typed_memory_view(175*131, inm.data()));
}

emscripten::val getOutputMatrixBytes() {
    return emscripten::val(emscripten::typed_memory_view(175*131, outm.data()));
}

// Defines svd function with the settings I want
Eigen::BDCSVD<Eigen::MatrixXf> svd;

// Performs svd on the input matrix
// Stores result in output matrix
void svdImage(int ncomp) {

    svd.compute(inm, Eigen::ComputeThinV | Eigen::ComputeThinU);

    const Eigen::MatrixXf &u = svd.matrixU();
    const Eigen::MatrixXf &v = svd.matrixV();
    const Eigen::VectorXf &sv = svd.singularValues();

    // I read the Eigen FAQ on how to optimize, there I found out about noalias()
    outm.noalias() = u(Eigen::all, Eigen::seq(0, ncomp)) * sv(Eigen::seq(0, ncomp)).asDiagonal() * v(Eigen::all, Eigen::seq(0, ncomp)).transpose();
}

// Code that embind used to provide bindings from wasm to javascript
// read documentation for more details
EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("getInputMatrixBytes", &getInputMatrixBytes);
    emscripten::function("getOutputMatrixBytes", &getOutputMatrixBytes);
    emscripten::function("svdImage", &svdImage);
}
```


<h3 class="border-bottom mb-3 mt-5" id="">Webworker code</h3>

The webworker is the thread that does the actual processing of the images from the webcam feed. It does the following:

1. It imports the generated wasm code with `importScripts`
2. when module is loaded with `onRunetimeInitialzed`, variables and a message event are defined
3. on message "start" a frame is received, and the webassembly code is called, and a frame is posted back to the main thread. The only noteworthy thing, is the use of [Uint8ClampedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray). When integers are outside the range between 0 and 255 they are set to either 0 or 255 whichever is closest. This is really useful for me, because the results from `Module.svdImage` are not always between 0-255, which causes artifacts when when showing the image on screen. The Uint8ClampedArray prevents this artifacting all together.

```javascript
importScripts("./HelloWasm.js")

Module.onRuntimeInitialized = () => {

    // Global variables
    let input_matrix_bytes = Module.getInputMatrixBytes()
    let output_matrix_bytes = Module.getOutputMatrixBytes()
    let ncomp = 0 

    self.onmessage = (e) => {
        switch (e.data.action) {
            case "start":

                // receive frame
                let frame = new Uint8ClampedArray(e.data.transferFrame);

                // process frame with the webassembly code
                input_matrix_bytes.set(frame)
                Module.svdImage(ncomp)
                frame.set(output_matrix_bytes)

                // transfer the ownership of the frame, back to the main thread for displaying
                self.postMessage({type: "test", frame}, [frame.buffer]);

                break;
            case "updateNcomp":
                NCOMP = e.data.ncomp
                break;
        }
    }
}
```

<h3 class="border-bottom mb-3 mt-5" id="">Javascript glue code</h3>

Then there is the JavaScript code in the main thread, which contains: some opencv code to process and display the images, defines how to UI works (what happens when you click a button), and sends frames from the webcam to the webworker and async/awaits a new frame to display on which a new frame is send.



```javascript
const ncompSlider = document.querySelector("#ncompSlider")
const startBtn = document.querySelector("#startBtn")
const stopBtn = document.querySelector("#stopBtn")
const video = document.querySelector("#videoInput")
const ncompDisplay = document.querySelector("#ncompDisplay")
ncompDisplay.innerHTML = parseInt(ncompSlider.value) + 1

const worker = new Worker("/worker.js")

let canvasFrame = document.getElementById("canvasFrame"); 
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


async function startFrameProcess() {

    // Open video stream
    if (video.srcObject == undefined) {
        try  {
            video.srcObject= await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        } catch {
            console.log("An error occurred! " + err);
        }
    }

    RUNNING = true
    let transferFrame = new Uint8Array(22925)
    startBtn.disabled = true
    stopBtn.disabled = false;

    while (RUNNING) {
        video.play()
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

```


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


async function startFrameProcess() {

    // Open video stream
    if (video.srcObject == undefined) {
        try  {
            video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        } catch {
            console.log("An error occurred! " + err);
        }
    }

    RUNNING = true
    let transferFrame = new Uint8Array(22925)
    startBtn.disabled = true
    stopBtn.disabled = false;

    video.play()
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

