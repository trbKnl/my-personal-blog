---
title: Pyspark tutorial
date: 2022-10-19
description: Learn how to configure Spark and begin writing your B.I.G. data processing code with Pyspark
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
and having a little knowledge on Pyspark will come in handy leveraging these technologies.

In this blogpost I will:

- Discuss how to install Pyspark locally
- Give a short tutorial on how to use Pyspark

<h3 class="border-bottom mb-3 mt-5" id="">Why Spark</h3>

Spark leverages a compute cluster to perform large operations on data.
With Spark you can perform operations on data which otherwise would be impossible.
However, in order to make sure you understand your Pyspark code you don't need a big cluster and you can just test it locally on your own machine.
This is less costly and a lot quicker.

My workflow with Pyspark is the following: 

1. I make sure my Pyspark code does what it was supposed to do by prototyping my code locally.
2. Then I apply my prototype in production to a large dataset, 
3. then I write unit tests to make sure my operations work and keep working as expected.

<h3 class="border-bottom mb-3 mt-5" id="">Install Pyspark locally</h3>

Installing Pyspark locally is not hard, but it depends on your OS how to do it exactly. So you might need to change these steps slightly for your usecase:

### Create a virtual env and install Pyspark

First we create a virtual env to keep all our downloaded packages seperate.
You will see that these packages are quite big and you will want to delete them whenever you are done with them.

Create a folder cd into it and run:

```
python3 -m venv ./env    # Create virtual env
source env/bin/activate  # Activate it
pip3 install pyspark     # Install Pyspark
```

### Install Spark

Installing is nothing more than downloading some files, and make Pyspark aware of where they are.

Pyspark needs Spark, so go to their [website](https://spark.apache.org/downloads.html) and download Spark, at the time of writing the latest version is Spark `3.3.0`. 
After downloading I moved the `<whatever-spark-version>.tgz`to the project folder and I unpacked with `tar -xf <whatever-spark-version.tgz`. 

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

# In order to kill your session: spark.stop()
```

### Read in data frames from external sources

Typically you would read in files that are stored on distributed file systems such as the hadoop file system, or some other file system.

This is an example on how to read a parquet file (parquet is a bunch of files in a folder) from the Azure Blob file system.

```python
df = spark.read.parquet("abffs://container@storageaccount.core.windows.net/my_folder/my_parquet.parquet")
```

`spark.read.fileformat` roughly translates to: use my spark connection to load in a file stored somewhere. Check the documentation how to read in other file formats (the command will be very similar).

Note that `df` is a reference to a DataFrame that is accessible to your spark compute cluster. 
Operations you perform on this Dataframe will happen on the compute cluster and not on the machine or VM you are working on yourself. 
Do not pull the Dataframe into the working memory of your machine without good reason. 

Typically you would reduce your dataframe with Spark first before you continue to work on it locally. 
For example, I would collect huge amounts of data from various sources, join them together, then perform some aggregations to get out the info I am looking for, and then I would work on the data locally (or not). Another use case could be to setup Spark in a data pipeline that would prepare the data on a daily basis ready for a dashboard to be consumed by upper management for them to base decision on. 
The dashboard software most likely cannot handle terrabytes of data so it should be aggregated by Spark first.

### The first commands you will use when inspecting a new DataFrame

I will use a example dataframe for the rest of this tutorial. Lets first create this example dataframe.

#### Create the example dataframe:

``` python
from datetime import datetime
import pyspark.sql.types as T

# Create a toy dataset to do the examples with
df = spark.createDataFrame(
    [
        (1, "A", 2, "X", 3, 1.2, datetime.strptime("2019-06-14", "%Y-%m-%d")),
        (2, "B", 5, "X", 3, 1.2, datetime.strptime("2019-06-14", "%Y-%m-%d")),
        (2, "B", 5, "X", 3, 1.2, datetime.strptime("2024-05-14", "%Y-%m-%d")),
        (2, "B", 5, "X", 3, 1.2, None),
        (2, "B", None, "X", 3, 3.3, None),
        (2, "A", 5, "X", None, None, datetime.strptime("2019-12-17", "%Y-%m-%d")),
        (4, "A", 9, None, 3, 0.23, datetime.strptime("2019-08-08", "%Y-%m-%d")),
        (4, "A", 9, None, 3, 0.23, datetime.strptime("2020-08-08", "%Y-%m-%d")),
        (4, "A", 9, "Y", 3, 0.3654, datetime.strptime("1234-01-02", "%Y-%m-%d")),
        (4, "B",10, "X", 1, 2.0, datetime.strptime("1234-01-02", "%Y-%m-%d")),
        (5, "A", 9, "X", 1, 9.0, datetime.strptime("8674-01-02", "%Y-%m-%d")),
        (4, "C", 3, "Z", 3, 7.0, datetime.strptime("9787-01-02", "%Y-%m-%d")),
    ],
    T.StructType(
        [
            T.StructField("id", T.IntegerType(), True),
            T.StructField("cat1", T.StringType(), True),
            T.StructField("val", T.IntegerType(), True),
            T.StructField("cat2", T.StringType(), True),
            T.StructField("count", T.IntegerType(), True),
            T.StructField("double", T.DoubleType(), True),
            T.StructField("date", T.DateType(), True),
        ]
    ),
)

# print what we have created
df.show()
```

```
+---+----+----+----+-----+------+----------+
| id|cat1| val|cat2|count|double|      date|
+---+----+----+----+-----+------+----------+
|  1|   A|   2|   X|    3|   1.2|2019-06-14|
|  2|   B|   5|   X|    3|   1.2|2019-06-14|
|  2|   B|   5|   X|    3|   1.2|2024-05-14|
|  2|   B|   5|   X|    3|   1.2|      null|
|  2|   B|null|   X|    3|   3.3|      null|
|  2|   A|   5|   X| null|  null|2019-12-17|
|  4|   A|   9|null|    3|  0.23|2019-08-08|
|  4|   A|   9|null|    3|  0.23|2020-08-08|
|  4|   A|   9|   Y|    3|0.3654|1234-01-02|
|  4|   B|  10|   X|    1|   2.0|1234-01-02|
|  5|   A|   9|   X|    1|   9.0|8674-01-02|
|  4|   C|   3|   Z|    3|   7.0|9787-01-02|
+---+----+----+----+-----+------+----------+
```

#### The first commands

Inspect your DataFrame:

``` python
df.show()    # Print the first 20 rows of your DataFrame
df.show(3)   # Print the first 3 rows of your DataFrame
df.count()   # Count the total number of rows in your DataFrame
```

Get the variable names from your DataFrame:

``` python
df.schema.names
```

```
['id', 'cat1', 'val', 'cat2', 'count', 'double', 'date']
```

Get the data types of the variables:

```python
df.dtypes
```

```
[('id', 'int'), ('cat1', 'string'), ('val', 'int'), ('cat2', 'string'), ('count', 'int'), ('double', 'double'), 
('date', 'date')]
```

Save your `df` to a file system:

``` python
# Write a Spark DataFrame to parquet
df.write.parquet("abffs://container@storageaccount.core.windows.net/folder/cool_dataset.parquet")
```

Pull the Dataframe from the spark cluster in your machine:

``` python
df = df.collect()  
df = df.toPandas()  # Or directly to a pandas DataFrame
```

### Explore your data with Pyspark

Here are some commands to get you started.
The commands that will follow can be combined in very creative ways. 
As you go through them note how very much they resemble their SQL counter parts.


Select variables with a filter.
I like to style these commands with `\` and line breaks. To make the sequence of operations very readable: select, filter than a show. 

``` python
df \
    .select("id", "cat1") \
    .filter("cat1 == 'A'") \
    .show()
```

```
+---+----+
| id|cat1|
+---+----+
|  1|   A|
|  2|   A|
|  4|   A|
|  4|   A|
|  4|   A|
|  5|   A|
+---+----+
```

Count all the rows  where the column "cat1" contains the string "A".

``` python
df \
    .filter("cat1 == 'A'") \
    .count()
```

```
6
```

Select the columns "id" and "cat1" and sort on first "id" and then on "cat1".

``` python
df \
    .select("id", "cat1") \
    .sort("id", "cat1") \
    .show()
```

```
+---+----+
| id|cat1|
+---+----+
|  1|   A|
|  2|   A|
|  2|   B|
|  2|   B|
|  2|   B|
|  2|   B|
|  4|   A|
|  4|   A|
|  4|   A|
|  4|   B|
|  4|   C|
|  5|   A|
+---+----+
```


Calculate the average on the variable "val" grouped by unique "id", then sort by "id".

``` python
import pyspark.sql.functions as F

df \
    .select("id", "val") \
    .groupby("id") \
    .agg(F.mean("val").alias("mean_val")) \  # rename this new variable to mean_val
    .sort("id") \
    .show()
```

```
+---+--------+
| id|mean_val|
+---+--------+
|  1|     2.0|
|  2|     5.0|
|  4|     8.0|
|  5|     9.0|
+---+--------+
```

### Data manipulation with Pyspark

Now will follow some commands that will perform basic data manipulations using Pyspark.


Rename the column "id" to "banana".

``` python
df \
    .select("id", "val") \
    .withColumnRenamed("id", "banana") \
    .show(1)
```

```
+------+---+
|banaan|val|
+------+---+
|     1|  2|
+------+---+
only showing top 1 row
```

Change all variable names to uppercase. This example clearly shows why its so powerful to mix SQL like functionality with the power of a programming language.
This is a fairly trivial example but you can use this to do very powerful things with limited code, that would have been very hard to do with just SQL.

``` python
# Create a copy of the df
new_df = df

# Change variable names to upper case
for varname in df.schema.names:
    new_df = new_df.withColumnRenamed(varname, varname.upper())

new_df.show(1)  # or df.schema.names (or df)
```

```
+---+----+---+----+------+------+----------+
| ID|CAT1|VAL|CAT2|COUNT2|DOUBLE|  DATEDATE|
+---+----+---+----+------+------+----------+
|  1|   A|  2|   X|     3|   1.2|2019-06-14|
+---+----+---+----+------+------+----------+
only showing top 1 row
```

Create a new column: "my\_column", by adding one to the column called "double". 
DataFrames in Pyspark are immutable, meaning if you want to see your changes reflected in the data you should assign the result to a new DataFrame.

``` python
cool_new_df = df\
    .select("id", "double")\
    .withColumn("my_column",
        F.col("double") + 1
    )

cool_new_df \
        .show(5)
```

```
+---+------+---------+
| id|double|my_column|
+---+------+---------+
|  1|   1.2|      2.2|
|  2|   1.2|      2.2|
|  2|   1.2|      2.2|
|  2|   1.2|      2.2|
|  2|   3.3|      4.3|
+---+------+---------+
only showing top 5 rows
```

Create a new column on the basis of "cat1", we will use the when, otherwise syntax for that:

``` python
again_a_new_df = df \
    .select("id", "cat1") \
    .withColumn("pear",
        F.when(F.col("cat1") == 'A',  # If true do this:
            "Contains the letter A"
        ).otherwise(  # Else do this instead:
            "Does not contain the letter A"  
        )
    )

# Show max 20 rows, and do not truncate the output
again_a_new_df.show(20, False)
```

```
+---+----+-----------------------------+
|id |cat1|pear                         |
+---+----+-----------------------------+
|1  |A   |Contains the letter A        |
|2  |B   |Does not contain the letter A|
|2  |B   |Does not contain the letter A|
|2  |B   |Does not contain the letter A|
|2  |B   |Does not contain the letter A|
|2  |A   |Contains the letter A        |
|4  |A   |Contains the letter A        |
|4  |A   |Contains the letter A        |
|4  |A   |Contains the letter A        |
|4  |B   |Does not contain the letter A|
|5  |A   |Contains the letter A        |
|4  |C   |Does not contain the letter A|
+---+----+-----------------------------+
```


Create a new variable on the basis of a window. The SQL equivalent would be something like OVER PARTION BY. 
I found this to be very useful, please check out tutorials on how to work with windows.
Here is a simple example that should make clear what it does:

``` python
from pyspark.sql.window import Window

df \
    .select("id", "val") \
    .withColumn("mean_val_grouped_by_id",
        F.mean("val").over(
            Window.partitionBy("id")
        )
    ) \
    .sort("id") \
    .show()
```

```
+---+----+----------------------+
| id| val|mean_val_grouped_by_id|
+---+----+----------------------+
|  1|   2|                   2.0|
|  2|   5|                   5.0|
|  2|   5|                   5.0|
|  2|   5|                   5.0|
|  2|null|                   5.0|
|  2|   5|                   5.0|
|  4|   9|                   8.0|
|  4|   9|                   8.0|
|  4|   9|                   8.0|
|  4|  10|                   8.0|
|  4|   3|                   8.0|
|  5|   9|                   9.0|
+---+----+----------------------+
```


An example of a left join on a Dataframe, first we create a dataframe that we can use to join with our example dataframe.

``` python
new_df = df \
    .select("id") \
    .distinct() \
    .withColumn("label",   # create a unique label
        F.concat(F.lit("my_new_label_id_"), F.col("id"))
    )


# Print the result
new_df.show()
```

```
+---+-----------------+
| id|            label|
+---+-----------------+
|  1|my_new_label_id_1|
|  5|my_new_label_id_5|
|  4|my_new_label_id_4|
|  2|my_new_label_id_2|
+---+-----------------+
```

Perform the left join.

``` python
df \
    .join(new_df, 'id', 'left') \
    .select(  
        df.id,         # keep id from df
        new_df.label   # keep label from new_df
    ) \
    .show()
```

```
+---+-----------------+
| id|            label|
+---+-----------------+
|  1|my_new_label_id_1|
|  5|my_new_label_id_5|
|  4|my_new_label_id_4|
|  4|my_new_label_id_4|
|  4|my_new_label_id_4|
|  4|my_new_label_id_4|
|  4|my_new_label_id_4|
|  2|my_new_label_id_2|
|  2|my_new_label_id_2|
|  2|my_new_label_id_2|
|  2|my_new_label_id_2|
|  2|my_new_label_id_2|
+---+-----------------+
```

### Use Spark as you would use SQL 

Spark has a sql module, all the operations I showed you above you can do with Hive SQL, a flavour of SQL. 
People who are afraid of change or code or both, will really appreciate this feature.
Hive itself is dead (probably heavy in use still), but its syntax can still be used with Spark and its very useful.

We can create a temporary view from our dataframe, this view we can use to query from.

``` python
df.createOrReplaceTempView("my_temp_table")

# We can use spark sql to query from our view
df = spark.sql("""
select
    *
from
    my_temp_table
""")

df.show()
```

``` 
+---+----+----+----+-----+------+----------+
| id|cat1| val|cat2|count|double|      date|
+---+----+----+----+-----+------+----------+
|  1|   A|   2|   X|    3|   1.2|2019-06-14|
|  2|   B|   5|   X|    3|   1.2|2019-06-14|
|  2|   B|   5|   X|    3|   1.2|2024-05-14|
|  2|   B|   5|   X|    3|   1.2|      null|
|  2|   B|null|   X|    3|   3.3|      null|
|  2|   A|   5|   X| null|  null|2019-12-17|
|  4|   A|   9|null|    3|  0.23|2019-08-08|
|  4|   A|   9|null|    3|  0.23|2020-08-08|
|  4|   A|   9|   Y|    3|0.3654|1234-01-02|
|  4|   B|  10|   X|    1|   2.0|1234-01-02|
|  5|   A|   9|   X|    1|   9.0|8674-01-02|
|  4|   C|   3|   Z|    3|   7.0|9787-01-02|
+---+----+----+----+-----+------+----------+
```

A more complicated query that you might typically use.
You can go crazy with this.

``` python
my_query_result = spark.sql("""
--- This is a comment
select 
    id as identifier,
    case 
        when cat1 == 'A' then 'B'
        when cat1 == 'B' then 'C'
        else 'Z'
    end as cat1,
    cast(val as double) as val_double,
    date
from
    my_temp_table
where
    date is not null
--- Limit is the Hive SQL version of T-SQL: top
limit 
    20
""")

my_query_result.show()
```

```
+----------+----+----------+----------+
|identifier|cat1|val_double|      date|
+----------+----+----------+----------+
|         1|   B|       2.0|2019-06-14|
|         2|   C|       5.0|2019-06-14|
|         2|   C|       5.0|2024-05-14|
|         2|   B|       5.0|2019-12-17|
|         4|   B|       9.0|2019-08-08|
|         4|   B|       9.0|2020-08-08|
|         4|   B|       9.0|1234-01-02|
|         4|   C|      10.0|1234-01-02|
|         5|   B|       9.0|8674-01-02|
|         4|   Z|       3.0|9787-01-02|
+----------+----+----------+----------+
```

Isn't that nice. Using pyspark you are in the position to combine tradional SQL operations with Python.

For example, you can use multiline f-strings to perform variable substitution, or perform a bunch of queries in a loop: first create some df's in a loop, and then join them. You can create really powerful and readible code in a few lines.

So when to use SQL and when to use pyspark code? I like to use SQL for simple operations, or if you need to communicate with your business intelligence colleagues.
Also what I saw often, is that the initial query of the data was performed using Hive SQL but manipulations after the initial SQL where done using Pyspark.

As soon as you find yourself writing a large and unreadable query, its definitely time to switch to pyspark code.

### Continue from here

Learn to use spark efficiently (look into caching your data manipulations). Read the documentation and have fun!
