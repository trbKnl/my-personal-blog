---
title: Pyspark tutorial
date: 2022-10-19
description: Configure and test your B.I.G. data processing code
---
 

<p style="text-align:center;">
 <img src="/spark.png" width="300" class="center"> 
</p>


<style type="text/css">
td {
    padding:0 15px;
}
</style>


<h3 class="border-bottom mb-3 mt-5" id="">Goal of this blog post</h3>

The goal of this blog post is to introduce Pyspark. Pyspark is a convenient library that provides Python bindings for Spark.
Lots of big data technology is built on top of spark, such as Databricks, Azure Synapse, Azure Data Factory. 
If you work in enterprise there is a big chance that you will work with one of these technologies, 
and having a little knowledge on Pyspark will come in handy, leveraging these technologies.

In this blogpost I will:

- Discuss how to install Pyspark locally
- Give a short tutorial on how to use Pyspark

<h3 class="border-bottom mb-3 mt-5" id="">Why Spark</h3>

Spark leverages a compute cluster to perform large operations on data.
With Spark you can perform operations on data, which otherwhise would be impossible.
However, in order to make sure you understand your Pyspark code you don't need a big cluster and you can just test it locally on your own machine.
This is less costly and a lot quicker.

My workflow with Pyspark is the following: 

1. I make sure my Pyspark code does what it was supposed to do by prototyping my code locally.
2. Then I apply my prototype in production to a large dataset, 
3. then I write unit tests to make sure my operations work and keep working as expected.

<h3 class="border-bottom mb-3 mt-5" id="">Install Pyspark locally</h3>

Installing Pyspark locally is not hard, but it depends on your OS how to do it exactly. So you might need to change these steps:

### Create a virtual env and install Pyspark

First we create a virtual env to keep all our downloaded packages seperate.
You will see that these packages are quite big and you will want to delete them whenever you are done with them.

Create a folder cd into it and run:

``` python
python3 -m venv ./env    # Create virtual env
source env/bin/activate  # Activate it
pip3 install pyspark     # Install Pyspark
```

### Install Spark

Installing is nothing more than downloading some files, and make Pyspark aware of where they are.

Pyspark needs Spark, so go to their [website](https://spark.apache.org/downloads.html) and download Spark, at the time of writing this is Spark `3.3.0`. Then I moved the `<whatever-spark-version>.tgz`to the project folder and I unpacked with `tar -xf <whateever-spark-version.tgz`. 


Also make sure you have a supported java version installed and active. Spark `3.3.0` works with Java `8/11/17`, each operating system is different, so depending on your operating system, you have to install java a little bit different.
I use Arch linux: so in my case I got the headless version of Java 17 from the official repo `sudo pacman -S jre17-openjdk-headless`. Note: if you work with multiple version of Java check the arch wiki.

The next step is to make the Spark initializating scripts aware where you installed Spark. This works with environmental variables that the scripts have access to.

```
export SPARK_HOME=/your/pyspark/folder/spark-3.3.0-bin-hadoop3/  # Location of your unpacked Spark.tgz
export PATH="$SPARK_HOME/bin:$PATH"                              # Add Spark scripts to your Path
export JAVA_HOME=/usr/lib/jvm/default                            # Tell Spark where Java is located
```

You can put these lines in your `.bashrc` or `.zhsrc` to make these variables persistent.

If all is well you can run `pyspark` and see something like this following:

```
$ pyspark
Python 3.10.8 (main, Oct 11 2022, 20:04:56) [GCC 12.2.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
22/10/19 15:05:29 WARN NativeCodeLoader: Unable to load native-hadoop library for your platform... using builtin-java classes where applicable
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /__ / .__/\_,_/_/ /_/\_\   version 3.3.0
      /_/

Using Python version 3.10.8 (main, Oct 11 2022 20:04:56)
Spark context Web UI available at http://asdasdasd:4040
Spark context available as 'sc' (master = local[*], app id = local-1666184730247).
SparkSession available as 'spark'.
>>>
```

For your own settings things will be slightly different, but if you understand these steps you can figure out what you should do on your own system.

### If installation fails

If installation fails, you can create a free tier account at [Databricks](https://www.databricks.com/try-databricks). And use Pyspark that way. You can also sign-up for Azure and use your free credit to tryout Pyspark.


<h3 class="border-bottom mb-3 mt-5" id="">Pyspark tutorial</h3>

The documentation of Pyspark is good, and you can find it [here](https://spark.apache.org/docs/latest/api/python/reference/index.html). Get used to reading the documentation a lot, I found that reading the docs is often the fastest way to solve your problem. In order to use the documentation efficiently you have to have a base understanding of what Pyspark is, and that is what this tutorial is for. It can also serve as an informal reference to example code.

To work with Pyspark you do not need to know a lot of Python, if your background is mainly SQL you will be totally fine. Pyspark works really well because you can combine Python with big data processing that very much resembles SQL (as we will see).

In this tutorial I will discuss:

- The Spark object
- How to read in data as a spark dataframe
- The first commands you will run on your dataframe
- Some basic data manipulation with Pyspark
- How you can use SQL with Pyspark


### The Spark object

The `spark` object is an object that represents your connection to the spark cluster. The nice thing about using Spark as a service, is that you do not have to configure your own Spark cluster.
The `spark` object is most likely available to you when starting up your environment.
For example Azure Synapse automatically creates an object named `spark` representing your connection to the cluster.

In order to check if you have a connection to a Spark cluster, do:

``` python
spark
```

For our examples we are going to run Spark locally, In order to create a local spark session:

```python
import pyspark
from pyspark.sql import SparkSession

# Create a local Spark session with the session builder
spark = SparkSession.builder \
      .master("local[1]") \
      .appName("Pyspark Tutorial") \
      .enableHiveSupport() \
      .getOrCreate()
```
