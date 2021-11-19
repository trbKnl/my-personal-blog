---
title: Machine learning in production
date: 2021-13-08
description: An overview of the steps you have to take to put machine learning into production
---

<style type="text/css">
td {
    padding:0 15px;
}
<! ---pre {  --->
<! ---    background-color: lightgray; ---> 
<! ---} ---> 
</style>



<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Goal of this blog post</h3>

In this blog post I will outline the general steps you need to take to put your fresh code into production for everybody to enjoy. The goal of this blog post is to give you a general idea of what is needed to put a machine learning application into production. Although, I won't go into great detail, I believe it is very useful to have seen all the steps you need to take to get from: nothing to a working application. Once you know what steps you can to take, you can fill in all the details yourself.

In this blog post I will discuss:

- How I created an application by writing some code
- How to create an API for the application with the python package FastAPI
- How to containerize your application with Docker so you can distribute your application as a container
- General steps you need to take to put your fresh container on online 

The end result is hosted [here](https://turdify.niekdeschipper.com) and the code can be found on [Github](https://github.com/trbKnl/TurdifyAPI).

<h2 class="border-bottom mb-3 mt-5" id="Introduction">Building an application</h2>

<h3 id="building-a-working-script">Building a working script: my process</h3>

For this blog post I wanted to make an application that detects faces in pictures and overlays the faces in the picture with an emoji.

I started to think about what programming language I wanted to use. Languages that work well for data science are: R and Python. They are high level so you do not need to write a lot of code. R and Python are both popular and readily available frameworks exists for them, so they are both valid options. In this case Python is my language of choice, because I like it a little more for non statistical applications, and I know it has useful packages for working with images.

I started searching for: "face recognition in Python", and I found [face-recognition](https://pypi.org/project/face-recognition/), which uses [d-lib](http://dlib.net/) which provides a pre-trained face recognition model written in C++. Why train your own model? Ain't nobody got time (and the data) for that. I started by finding out how the face\_recognition package works. I started looking at the documentation of the package to see if they provide an example so I know what my code should look like. Sometimes I am lazy and I want to find a Stackoverflow answer that provides me with exactly what I want, but more often than not that will end up taking more time, because I miss obvious things that are explained in the documentation.  

This is the function I ended up creating first, a function to detect faces in an image:

``` python
def detect_face_locations(image_buf: bytes) -> list:
    """Detect faces that may or may not be in in an image buffer"""

    image = face_recognition.load_image_file(image_buf)
    face_locations = face_recognition.face_locations(image)
    print(face_locations) # who doesnt like a random print statement
    return face_locations
```

The first mini problem to solve was how to load the image. After checking the docs, I found the function `load_image_file`. The name of the function does not leave much to the imagination. The [documentation](https://face-recognition.readthedocs.io/en/latest/face_recognition.html) of that function shows you can provide a path to a file or a file object. I began to use the function by providing a path to an image file to see if it could load the image. After I confirmed that the function worked, I stated experimenting with a file objects stored in bytes buffers `io.BytesIO()`, sounds fancy but it is nothing more than a buffer that stores binary data, I used it to store an image. You need to do it this way, because users need to upload images to your program. 

The next step was finding out how to mask theses faces with an emoji. In order to find out how to do this, I searched for: "paste one image over the other python" and I came across the PIL library, which I already knew about beforehand, and I remembered liking it because its well documented. 

I started writing the code and ended up with a function that works as follows: 

1. As input the function takes an image, it thenextract the faces from the image. 
2. The function opens the emoji image you want to paste over the image with the faces. For each face you recognize, paste an emoji over the face, the emoji is sized to the proportions of the face
3. The function returns the newly created image as a png image 

The function looks like this:

```python
def turdify_image(image_buf: bytes) -> bytes:
    """Paste turd emoji over detected faces in an image"""

    face_locations = detect_face_locations(image_buf)

    # Open the image buffer and the turd as PIL image
    with Image.open(image_buf) as im, Image.open(f"{PATH}/assets/turd.png") as turd:
        # Get the turd dimensions
        tw = float(turd.size[0])
        th = float(turd.size[1])

        for box in face_locations:
            # Resize the turd according to the size of the face,
            # and paste it over the face region
            x, y, a, b = box[::-1]
            basewidth = a - x
            ratio = float(basewidth) / tw
            turd_resized = turd.resize((int(tw * ratio), int(th*ratio)))
            im.paste(turd_resized, box=(x, int(b * 0.95)), mask=turd_resized)

        # Save the created image as png in a buffer and return
        buf = io.BytesIO()
        im.save(buf, format="png")
        buf.seek(0)       # Return to beginning of buffer
        data = buf.read() # Read all bytes until EOF
    return data
```

And with just these 2 function the main program is done. 

You can work these 2 functions into a script and call it quits. This would be perfectly fine if: your users  know how to run scripts and know how to install python packages. All these things are not too much to ask, but if your app is as useless as this app then it really *is* too much to ask and nobody will use your app. In order for your friends to be willing to try your app out, you need to provide them with a friendly way to do so. 

<h3 id="api">Create an API for your application</h3>

In order to let users interact with your application you need an interface, a so-called: application interface (API). An application interface is a set of rules that specify how you can interact with the application. You need a set of rules, how else would you talk to your applications?

In this example I will use a HTTP REST API. It sounds very fancy, but in this case it means that the API follows a couple of set rules and it uses the HTTP protocol: the most common protocol on the internet that you use every day. HTTP defines a set of actions (methods) that act on a resource (all the methods are listed [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)). For example if you want to retrieve a web page at the resource niekdeschipper.com, you can use the GET method on the resource niekdeschipper.com. The resource is specified using a uniform resource locator (URL), that indicates where the resource can be found. If you type niekdeschipper.com in your browser the GET method is implied and your browser will try to GET the webpage that is served at niekdeschipper.com/. In this example the resource is a webserver that understand that you want to GET an html page from it.

In order for your users to interact with your application you need an API. In most cases you will not make an API from scratch, but you will use a package that does the heavy lifting for you. For the turdify application, I made use of [FastAPI](https://fastapi.tiangolo.com/), a python package that lets you write an API with minimal code. I strongly recommend to check out some of their minimal working examples to learn how to make one yourself, their documentation is great.

For the turdify application I started thinking about what my API should look like. The turdify application needs an image from a user, it processes the image and sends it back. So users need to be able to send image data to a resource (in this case that resource is a server). I know that the method POST is suitable for sending data to a resource as stated [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods):

*"The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server."*

I started writing the code for the API, and I ended up with:

```python
@app.post("/turdify/")
async def create_image(my_file: UploadFile = File(...)):

    contents = await my_file.read()  # Read file
    image_buf = io.BytesIO(contents) # Store in IO buffer
    if is_valid_image(image_buf):
        image_buf = rotate_image(image_buf)
        data = turdify_image(image_buf)  # Turdiy
        return Response(content=data, media_type="image/png")
    else:
        raise HTTPException(status_code=415, detail="Unsupported Media Type: File is not recognized as an image")
```
This piece code defines a POST method at the endpoint \<location-of-the-server\>:\<port-number\>/turdify/ (Note: I switched to the term endpoint instead of resource, because it is more accurate. Read about the differences between end points and resources [here](https://stackoverflow.com/questions/30580562/what-is-the-difference-between-resource-and-endpoint). In this case the difference is not very important.)

If you POST a file to the endpoint: \<location-of-the-server\>:\<port-number\>/turdify/ the function `create_image` will be executed. This function will:
1. Store the data the user send in memory
2. Checks whether the data received is an image
3. if it is a valid image: do the modifications and return the end result. 

With this code in place users can POST an image to the endpoint and a modified image will be send back. The users will need an application that is able to make HTTP requests. Such programs are: your browser, curl, postman and probably a lot more. I like to use curl if I am not interacting with a webserver, curl is simple and free, check it out!

If you want to have an application with FastAPI up and running, check their [tutorial](https://fastapi.tiangolo.com/tutorial/first-steps/) it shows the minimal needed code, and the setup you need for development. If you want to look at the all the code presented here check [Github](https://github.com/trbKnl/TurdifyAPI).

<h3 id="api">Containerize your application</h3>

Now that we have some code that can function as an application. We need to be able to distribute the code in a uniform way. This is where Docker comes in. Docker makes it easy to package and distribute the application in such a way that is independent from the system it is being run on. With Docker you can bundle your code, together with an operating system and package it as a container. An advantage is that you package your code together with all the dependencies needed to run the code. So if you give me your container I will be able to run it without having to install all the packages you used, you already installed them for me onto the image.

Docker gives you the tools to do all this. The process goes like this:

1. On [Dockerhub](https://hub.docker.com/) you can find freely available base images that might be suitable for your application
2. You write the instructions (in a text file called `Dockerfile`) on how you want to bake your code on to that base image 
3. You can run the newly created image (with your code on it) and you can give that to anyone to use and to run. You can also put it on a platform that can host that container for you so other people can access it.

An example is helpful here. Let's make a simple python webserver that serves a html document. To do that create directory that looks like this: 

```
.
├── Dockerfile
└── public
    └── index.html

1 directory, 2 files
```

`index.html` can be any random html page you like, for example: `<h1>Does not matter at all</h1>`. Now that we have the code. Let's create a `Dockerfile` containing the instructions to build the container, all `Dockerfile`s look something like his:

```dockerfile
# The image we want to use as our basis to install our code on
FROM python:3.9-alpine

# Copy all the contents of our directory to a folder on the image called /app (the folder /app will be newly created for you)
COPY . /app

# Change the working directory to be /app, this directory will now be the reference for all future actions
WORKDIR /app

# Expose port 8080 on our container to the outside world
EXPOSE 8080

# Start our webserver on port 808, and host all the files in ./public
ENTRYPOINT ["python3", "-m", "http.server", "8080", "--directory", "./public"]
```

In order to build it into a container you need Docker. If you have Docker installed you can build your image as follows: change your working directory to the directory the `Dockerfile` is located in and then run the command:

```
$ docker build -t simple_webserver:latest .
```

If this is successful you can start your container as follows:

```
$ docker run  -p 8080:8080 -t simple_webserver:latest
```

go to [http://localhost:8080](http://localhost:8080) to view the webpage that is served by your container! The `Dockerfile` of the turdify app looks very similar and can be found on [Github](https://github.com/trbKnl/TurdifyAPI). 

In this section we discussed the most important steps you need to understand in order to build your own containers. You can give this container to anyone and they can make it work on their machine without a lot of effort. You can keep using this container for ever, even if you update all your local packages this container will keep on working.

<h3 id="api">Deploy your application</h3>

So far we discussed how to write an API for an application and how to containerize an application. In this last section I will briefly discuss the most basic way you could deploy an application on your own hardware. The steps you need to take are:

1. You need to buy a domain name
2. Point this domain name to an IP address of a machine you own
3. Start the Docker container on the machine your domain name is pointing to

A basic setup could for example be: 
1. Have a raspberry pi (or a spare laptop) and connect it to your router (with WiFi or ethernet).
2. Point your domain name to the external IP address of your router (This IP address is provided by your ISP). You can to do this on the website that sold you the domain name.
3. Go into the settings of your router and forward all incoming traffic on port 80 to the internal IP address and port number of your raspberry pi (probably something like 192.168.1.X). The port number should be the number that your container is listening on. Pro tip: give your raspberry pi a static IP address so it won't change on you, you can also configure that in your router (in most basic home setups the router leases out internal IP addresses to all devices on your network).

This setup would be good enough for hosting your personal website. But in a professional environment you would host your containers on a container orchestration platform built with [kubernetes](https://kubernetes.io/). In another blog post I will go into more detail how I built and configured a small kubernetes cluster of raspberry pi's.


