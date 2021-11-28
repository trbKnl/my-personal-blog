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
Without `asyncio` when you run a (single threaded) program and an input output (I/O) action happens (a database read, waiting for user input, etc.) your program will continue doing its thing when this action is completed. In the mean time, while this I/O action is happening, your program is doing nothing. Wouldn't it be cool if your program could do something else, while waiting for this I/O action to complete? That is what `asyncio` is all about. 

In this blog post you will learn:

* The `async/await` syntax introduced by the `asyncio` package
* How to use websockets, we will use this to send data back and forth between client and server 

First, I will briefly discuss the topic and the syntax involved and then we will dive into an example. Which in this case is very helpful, there is a lot of terminology involved which can be confusing.

<h2 class="border-bottom mb-3 mt-5" id="Introduction">An introduction to async/await syntax</h2>

`Asyncio` lets you write concurrent code, with concurrent code you can make your programs do other things while an I/O operation is happening. An example of where this is useful is a webserver. The webserver could serve other people, while waiting for input from other people.

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

An awaitable is a piece of code that can be awaited on, an awaitable is special, meaning, when something is awaited, other coroutines are allowed to run. So in this example, while the `hello()` function is sleeping for 10 seconds. Other coroutines could be doing something: such as database reads, calculations, checking if users supplied input and so on. When the 10 seconds are up, the coroutine `hello()` will be resumed, and `"bye"` will be printed to the console.


Coroutines are functions defined with the `async` keyword (see the definition of `hello()`). 

Awaitables are indicated using the `await` keyword. In this example `await asyncio.sleep(5)` is not returning anything. But it is possible to await a coroutine that does return data, we will see that in an upcoming example.

In order to execute a coroutine you can use the `asyncio.run()` function. This function will add your coroutine to the event loop. The event loop is what makes that this whole thing work. The event loop works like this:

1. Beginning of the event loop
2. Execute code 
3. If something needs to be awaited, check if other coroutines can be executed
4. Execute code 
5. Check if awaitables have been returned, if yes, resume code execution from there
4. Execute code 
5. Go back to 1 until there is no more code left to execute 

<h2 class="border-bottom mb-3 mt-5" id="Introduction">A simple example</h2>

Although nothing spectacular, the next example perfectly illustrates how asynchronous code could be useful.
In this example I created a *blocking* version of `hello()` and a *non-blocking* version of `hello()`. 
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
    # and awaits all its results
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

The previous example pinpoints the important concepts. But it is not very interesting because it only uses `sleep()` and it wasn't very interactive. When I encountered these examples I thought, 
oke cool, I get it... I think, but now what? 

That is why I will discuss an example here that is less trivial. This example will demonstrate clearly why concurrent code is awesome.




<h3 id="building-a-working-script">The full code</h3>

#### The client program

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

#### The server program

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



