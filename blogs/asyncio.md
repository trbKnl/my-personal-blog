---
title: Concurrent programming in Python with Asynchronous I/O
date: 2021-11-22
description: An introduction to asyncio with an example 
---

<style type="text/css">
td {
    padding:0 15px;
}
</style>


<h3 class="border-bottom mb-3 mt-5" id="goal-of-this-blog-post">Goal of this blog post</h3>

In this blog post I will talk about the `asyncio` library in Python. This is a Python library that lets you write concurrent code using the `async/await` syntax. 
Without `asyncio`, when you run a (single threaded) program and an input output (I/O) action happens (a database read, waiting for user input, etc.) your program will wait for the I/O action to complete and then it will continue doing its thing. In the mean time, while this I/O action is happening, your program is doing nothing. Wouldn't it be cool if your program could do something else, while waiting for this I/O action to complete? That is what `asyncio` is all about. 

In this blog post you will learn:

* The `async/await` syntax introduced by the `asyncio` package
* How to use websockets, we will use this to send data (asynchronously) back and forth between client and server 

I will start by briefly discussing the topic and the syntax involved and then we will dive into an example, because an example say more than a thousand words. 
This blog post adds something to the other explanation on the web because it includes a non-trivial and hopefully an interesting example of an asynchronous program. 

<h2 class="border-bottom mb-3 mt-5" id="Introduction">An introduction to async/await syntax</h2>

`Asyncio` lets you write concurrent code, with concurrent code you can make your programs do other things while an I/O operation is happening. An example of where this is useful is a webserver. The webserver could serve one person, while waiting for input from another person.

`Asyncio` works with coroutines and awaitables. A coroutine is a function with awaitables in it. Here is an example:

```pyton
import asyncio

# This is a coroutine, which is indicated by the async keyword
async def hello():
    print("hello")

    # This is an awaitable during an awaitable other coroutines are allowed to run
    await asyncio.sleep(5)
    print("bye")

# To run the coroutine use asyncio.run()
asyncio.run(hello())
```

An awaitable is a piece of code that can be awaited on, an awaitable is special, meaning, when something is awaited, other coroutines are allowed to run. So in this example, while the `hello()` function is sleeping for 5 seconds. Other coroutines could be doing something else in the meantime: such as database reads, calculations, checking if users supplied input and so on. When the 5 second sleep is up, the coroutine `hello()` will be resumed, and `"bye"` will be printed to the console.

Coroutines are functions defined with the `async` keyword (see the definition of `hello()`). A coroutine must have an awaitable in it.

Awaitables are indicated using the `await` keyword. Note: In this example `await asyncio.sleep(5)` is not returning anything. But it is possible to await a coroutine that does return data, we will see that in an upcoming example.

In order to execute a coroutine you can use the `asyncio.run()` function. This function will add your coroutine to the event loop. The event loop is what makes that this whole thing work. The event loop works like this:

1. Beginning of the event loop
2. Execute code 
3. If something needs to be awaited, check if other coroutines can be executed
4. Execute code 
5. Check if awaitables have returned, if yes, resume code execution from there
4. Execute code 
5. Go back to 1 until there is no more code left to execute 

Because you add coroutines in an event loop, that keeps polling if coroutines are finished, while in the mean time running other code. Your program can run very efficiently, creating the illusion that everything happens at the same time.


<h2 class="border-bottom mb-3 mt-5" id="Introduction">A simple example</h2>

The next example perfectly illustrates how asynchronous code could be useful.
In this example I created a *blocking* version of `hello()` and a *non-blocking* version of `hello()`. 

Try the code yourself.

Can you predict what will be printed to the console, and how long each function will take?

```python
import asyncio
import time

async def hello_nonblocking():
    print("hello")
    await asyncio.sleep(5)
    print("bye")


def hello_blocking():
    print("hello")
    time.sleep(5)
    print("bye")


async def main_nonblocking():
    # gather() lets coroutines run at the same time
    # and await all its results
    await asyncio.gather(
        hello_nonblocking(),
        hello_nonblocking(),
        hello_nonblocking()
    )

def main_blocking():
    hello_blocking()
    hello_blocking()
    hello_blocking()


t = time.time()
main_blocking()
elapsed_time = time.time() - t
print(f"The blocking version took: {elapsed_time} seconds")

t = time.time()
asyncio.run(main_nonblocking())
elapsed_time = time.time() - t
print(f"The non-blocking version took: {elapsed_time} seconds")
```

<h3 id="building-a-working-script">An example with websockets</h3>

The previous example pinpoints the important concepts. But it is not very interesting because it only uses `sleep()`.  When I encountered these examples I thought, 
oke cool, I get it... I think, but now my program can sleep concurrently? That seems pointless.

That is why I will discuss an example here that is less trivial. This example will demonstrate clearly why concurrent code is awesome.
The example will make use of websockets (A websocket is a lot like a normal [socket](https://en.wikipedia.org/wiki/Network_socket), but if you don't know those, forget about it). You can read from and write data to a socket, just like you would from a file, but then it works over a network (such as your home network or the internet). If you write bytes, strings, whatever to a websocket, somebody on the other end of the network could read from it and receive your data.

A websocket can be used to send real time data back and forth, for example, to update the leader board for a game. 

A websocket works as follows:

1. A server creates the websocket using a port number
2. Clients can connect to the websocket using the specified port number and the IP address of the server
3. Data can now be send and received from server to client with `websocket.send()` and `websocket.recv()`

Websockets are ideal for this example because reading from, and writing to websockets is awaitable. Meaning, that when the server is waiting to receive data from a client, in the meantime it can do other things. So if a client is slow, and has not send any data yet, the server is not blocked and can server other people.

In this example I am going to create a client program and a server program. First we will discuss the client program, and then the server program

This is the code for the client program:

```python
#!/usr/bin/env python

import asyncio
import websockets
import random

async def client_program():
    uri = "ws://localhost:8765"

    async with websockets.connect(uri) as websocket:
        greeting = await websocket.recv()
        print(greeting)

        name = input("What is your name? ")
        await websocket.send(name)

        actions = ["crunching numbers", "database inserts", 
                   "vlookups in excel", "deleting stuff", 
                   "formatting disk", "looking for aliens", 
                   "buying and selling bitcoin", "disconnect"]

        probability_of_occurring = [0.3, 0.2, 0.2, 0.1, 0.05, 0.05, 0.05, 0.05]

        try:
            while True:
                # pick a new action and take up to 3 seconds to carefully think about it
                await asyncio.sleep(random.randint(0, 3))
                action = random.choices(actions, probability_of_occurring)[0]

                print(f"(client) The server is going to preform: {action}")
                await websocket.send(action)

                response = await websocket.recv()
                print(f"(client) Response from server: {response}")
        except websockets.exceptions.ConnectionClosedOK:
                print(f"(client) Disconnected from server")

asyncio.run(client_program())
```

The client program works as follows:

1. It connects to the servers websocket using the uri
2. The client will wait for a message from the server and print it to the console
3. You are asked to type in your name
4. Your name is send to the server
5. 1 of 8 actions is picked at random, one of them is disconnect
6. This action is send to the server
7. The client will wait for a response from the server and print it to the console
8. Go back to step 5 until the server disconnects

In short: you send a random made up action to the server, wait for its response and print it to the screen, until disconnect. 


Onto the server program program. The server program consists of three functions: 

- `costly_io_operation()` which simulates a costly operation that can be done asynchronous such as reading from a database, or doing some calculation elsewhere. 
- `server()` which is the webserver
- `main()` which is the main program that makes it work


The code is as follows:

```python
#!/usr/bin/env python

import random
import asyncio
import websockets

HOST = "127.0.01"
PORT = 8765

async def costly_io_operation(name: str, action: str) -> str:
    # Determine the "processing time" by drawing a random integer
    processing_time = random.randint(0, 5)
    print(f"(server) Performing {action} for client: {name}")

    # Simulate a costly IO operation by sleeping, allowing other coroutines to run
    await asyncio.sleep(processing_time)
    print(f"(server) Preformed {action} for client: {name} in {processing_time} seconds")

    return f"{action} was successful"


async def server(websocket, path):
    await websocket.send("Connected to server")
    print("(server) Client connected to server ")

    # Receive the clients name
    client_name = await websocket.recv()
    print(f"(server) Clients name is: {client_name}")

    # Wait on the first action to perform
    action = await websocket.recv()

    while action != "disconnect":
        response = await costly_io_operation(client_name, action)
        await websocket.send(response)

        print(f"(server) Awaiting new action from client: {client_name}")
        action = await websocket.recv()

    print(f"(server) client: {client_name} wants to stop, closing connection")
    await websocket.close()


async def main():
    print("(server) Starting server, waiting for clients to connect...")
    async with websockets.serve(server, HOST, PORT):
        await asyncio.Future()  # run forever


asyncio.run(main())
```

The server program works as follows:

1. It waits for a client to connect and sends a message
2. It waits for the client to sends its name, and prints it to the console
3. It awaits an action from the client
4. It performs the action 
5. And sends the result from the action back to the client
6. Back to 3, until the action is to disconnect

In short: `main()` listens for connections and hands them off to `server()`, which does costly IO operations with `costly_io_operation()`.

To run these scripts, save the as `client.py` and `server.py` and make them executable with `chmod +x ./client.py ./server.py`. Which means, change the mode of these files to make them executable. You need to have the libraries installed.

First start the server with,

```bash
$ ./server.py
```

Then fire up multiple clients, in separate terminals with,

```bash
$ ./cient.py
```

And watch the server go to work! Because the server uses asynchronous code, it can handle multiple clients at once, while the server is waiting for the results of one client, it can accept actions from other clients.

Really fun is to push this server to its limits and experience asyncio to its fullest potential.
You can do that by firing up a server in a terminal, and let **a lot of clients connect at the same time**.

You can connect multiple clients to the server using:

```bash
$ for client in client{1..10}; do echo $client | ./client.py &; done
```

This line means; generate 10 strings, "client1", "client2" ... "client10", for each of these strings, send them to input of the client program (with the pipe operator `|`), this will simulate you typing in the name of the client and then it frees up the terminal by sending the program to the background with `&`. This is needed so another client can be fired up in the same terminal.

How many clients can your server handle?

Ten?
```bash
$ for client in client{1..10}; do echo $client | ./client.py &; done
```

A hundered?

```bash
$ for client in client{1..100}; do echo $client | ./client.py &; done
```

Thousand?
```bash
$ for client in client{1..1000}; do echo $client | ./client.py &; done
```

Tip: If want to stop running all the clients just `Control + C` the server program and all the clients will crash.


<h3 id="building-a-working-script">Not just any function can become a coroutine</h3>

If you want to use asyncio you need to use packages that are compatible with asyncio. 

If you want to use a redis database with Python, you can use the Python package `redis`. The functions from the `redis` package cannot be awaited and therefore they will be blocking! But you can also use the `aioredis` package which adds asynchronous support. So you can read and write to a redis data base asynchronously. 

Conclusion: You need Python libraries with asynchronous support! Luckily, there are a lot of them, such as `websockets` and `aioredis` and many more.


<h3 id="building-a-working-script">The full code</h3>

The client program:

```python
#!/usr/bin/env python

import asyncio
import websockets
import random

async def client_program():
    uri = "ws://localhost:8765"

    async with websockets.connect(uri) as websocket:
        greeting = await websocket.recv()
        print(greeting)

        name = input("What is your name? ")
        await websocket.send(name)

        actions = ["crunching numbers", "database inserts", 
                   "vlookups in excel", "deleting stuff", 
                   "formatting disk", "looking for aliens", 
                   "buying and selling bitcoin", "disconnect"]

        probability_of_occurring = [0.3, 0.2, 0.2, 0.1, 0.05, 0.05, 0.05, 0.05]

        try:
            while True:
                # pick a new action and take up to 3 seconds to carefully think about it
                await asyncio.sleep(random.randint(0, 3))
                action = random.choices(actions, probability_of_occurring)[0]

                print(f"(client) The server is going to preform: {action}")
                await websocket.send(action)

                response = await websocket.recv()
                print(f"(client) Response from server: {response}")
        except websockets.exceptions.ConnectionClosedOK:
                print(f"(client) Disconnected from server")

asyncio.run(client_program())
```

The server program: 

```python
#!/usr/bin/env python

import random
import asyncio
import websockets

HOST = "127.0.01"
PORT = 8765

async def costly_io_operation(name: str, action: str) -> str:
    # Determine the processing time by drawing a random integer
    processing_time = random.randint(0, 5)
    print(f"(server) Performing {action} for client: {name}")

    # Simulate a costly IO operation by sleeping, allowing other coroutines to run
    await asyncio.sleep(processing_time)
    print(f"(server) Preformed {action} for client: {name} in {processing_time} seconds")

    return f"{action} was successful"


async def server(websocket, path):
    await websocket.send("Connected to server")
    print("(server) Client connected to server ")

    # Receive the clients name
    client_name = await websocket.recv()
    print(f"(server) Clients name is: {client_name}")

    # Wait on the first action to perform
    action = await websocket.recv()

    while action != "disconnect":
        response = await costly_io_operation(client_name, action)
        await websocket.send(response)

        print(f"(server) Awaiting new action from client: {client_name}")
        action = await websocket.recv()

    print(f"(server) client: {client_name} wants to stop, closing connection")
    await websocket.close()


async def main():
    print("(server) Starting server, waiting for clients to connect...")
    async with websockets.serve(server, HOST, PORT):
        await asyncio.Future()  # run forever


asyncio.run(main())
```



