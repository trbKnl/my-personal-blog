---
title: Learning Elixir, my study notes
date: 2023-02-20
description: How and why you should Learn Elixir
---

<style type="text/css">
td {
    padding:0 15px;
}

.force-word-wrap pre code {
  white-space : pre-wrap !important;
}
</style>


<p style="text-align:center;">
    <img src="/Official_Elixir_logo.png" width="500" class="center">
</p>

# Learning Elixir: Why?

Why am I learning Elixir? I have to know some Elixir for my current job, but ended up really liking it. So I want to study it some more.
It reminds me a lot of how I used `R`, the language I first started with. 
I basically used `R` as a functional language, without even knowning what a functional language was. 
After `R`, I spend some time learning object oriented programming, I never really liked to do object oriented programming myself, and I don't use it if I can avoid it.

In come Elixir, my first functional language. Teaching me you can create good abstractions without mutable objects, methods and classes.

So, whats cool about Elixir? For one it has very nice features, such as patternmatching. 

But the main draw for me so far is:

* The syntax: very short and good looking
* Its built on Erlang: therefor Elixir is robust and highly concurrent, which I really like
* Very good documentation: on the same level as `R` and its built in as well

Elixir also unix pipes built in, just like `R`. Which I know an `R` lover can appreciate.

# Learning Elixir: Resources

The main resource for learning is the official [Getting Started](https://elixir-lang.org/getting-started/introduction.html), you can find everything there.

I am currently reading 2 books:

* [Learn Functional Programming With Elixir](https://www.amazon.com/Learn-Functional-Programming-Elixir-Foundations/dp/168050245X)
* [Elixir in action](https://www.manning.com/books/elixir-in-action-second-edition)

And I like them both.

And also an [Elixir style guide](https://github.com/christopheradams/elixir_style_guide) so you can code in style.

# Learning Elixir: My notes

When learning a new programming language, the first thing I like to learn is:

* What is the language about?
* What are the most important data types?
* What are the semantics of the language?

When you know these things, you can effectively read the documentation and really get going.

I use these notes as a quick reference in case I forget something. 
Its a good intermediate between the documentation and reading the official Elixir tutorial (which is good).

These notes are verbose enough so you have some context, but terse enough that you don't have to scroll through too much text.

# Elixir: What is it about?

Elixir is a functional language. 

Elixir is dynamically typed.

All data types in elixir are immutable.
Copies are always returned because everything is immutable. 
Copies are created in a smart way, so they seem copies but actually aren't, therefore there is minimal copying overhead.

Functions do not have side effects. They return their output, and do nothing else! 

Documentation of Elixir is amazing.
Get documentation on funtions, modules, operators:

``` elixir
h Enum.each
h File
h case
```

All code can be run in an interactive shell: `iex`

# The = match operator

`=` is the match operator, it tries to bind the right-hand side to the left-hand side to make the statement true.
This is an very important feature of Elixir.

Example: 

```elixir
list = [1, 2, 3]
[a, b, c] = list

{_date, time} = :calendar.local_time
{_, {hour, _, _}} = :calendar.local_time

[head | tail] = [1, 2, 3]

{:ok, file} = File.open("./myfile")
```

Patternmatches can be chained:

```elixir
a = (b = 3 + 1)

datetime = {_date, time} = :calendar.local_time
datetime
time

# This ensures x will be a map if the patternmatching succeeds
x = %{} = y
```

In functions, you can overload and patternmatch:

``` elixir
defmodule Mul do
  def mul({:two, a}) do
    a * 2
  end
  def mul({:three, a}) do
    a * 3
  end
end

Mul.mul({:two, 2})
Mul.mul({:three, 2})
```

ignoring a value with underscore:

``` elixir
[a, _b] = [1, 1]
[a, _] = [1, 1]
```

Variable can't be bounded once:

```elixir
[a, a] = [1, 1]
[a, a] = [1, 2]     # does not work
```

keep value of a fixed with caret called pin operator:

```elixir
a = 1
^a = 2
```

see this example

``` elixir
list1 = [1,2,3]
list2 = [4 | list1]
```

# Types in Elixir

The most important complex data types are: Map, Tuple, List.

## Map

Map is a key value store (dict in Python).

``` elixir
# Map declarations
%{:a => "c", :b => "b"}
%{a: "a", b: "b"}

a = %{a: "a", b: "b"}
a[:a]
a.a

# Check if map has key:
%{ a: _ } = %{ a: "aaa", b: "bbb" }
%{ c: _ } = %{ a: "aaa", b: "bbb" }
Map.has_key?(%{ a: "aaa"}, :a)

# Update the value of key in map
my_map = %{ a: "a", b: "b", c: "c" } 
%{my_map | a: "aaa"}
```

## Tuple

Tuple module has function to work with tuples

``` elixir
person = {"Bob", 30}
elem(person, 0)
put_elem(person, 2, "Frikandel")

import Tuple
Tuple.append(person, "Alice")
```

## List

Lists are implemented as singly linked lists. Most operations are O(n).

``` elixir
person = ["Bob", "Alice"]
length(person)

# Enum is the go to module to work with enumerables
Enum.at(person, 1)
Enum.fetch(person, 1)      # Returns {:ok, "Alice"}
Enum.fetch(person, 3)      # Returns :error
Enum.fetch!(person, 5)     # Throws Enum.OutOfBoundsError
[head | tail] = person     # Used a lot in recursion
```

``` elixir
[1,2,3] ++ [4]   # concatenation
[1,2,3] -- [1]   # difference 
1 in list        # element in list
```

## Keyword Lists

An example how you can use default arguments:

``` elixir
# Keyword list
[aap: "aap", crocodile: "crocodile"]

# A keyword list just a normal list
[a: 1, b: 2] == [{:a, 1}, {:b, 2}]
```

If a keyword list appreas as the last item in any context, you can leave the square brackets off. 
This is useful for supplying arguments to a function.
This really tripped me up the first time I saw it.

```elixir
# Example of keyword list as the last item
# notice the lack of square brackets
fun.(x, y, a: "a", b: "b", c: "c")
```

## MapSet

Is the set data structure:

```elixir
x = MapSet.new()
x = MapSet.put(x, "ASD")
x = MapSet.put(x, "QWE")
x = MapSet.put(x, "QWE")
MapSet.member?(x, "QWE")
```

## Struct

Struct is a typed map. One module can only define a single struct:

```elixir
defmodule MyStruct do
  # Keyword list provides fields and their initial values
  defstruct a: "A", b: "B"
end

my_struct = %MyStruct{}
my_struct = %MyStruct{a: "a", b: "b"}

# Patternmatch a struct
%MyStruct{a: a, b: b} = my_struct

# Struct can't patternmatch a map
%MyStruct{a: a, b: b} = %{a: "a", b: "b"}
%{a: a, b: b} =  %MyStruct{a: "a", b: "b"} 
```

## String

```elixir
"abcdefg"

# format strings, string interpolation
x =  "format strings, string interpolation"
"text: #{x}"

# <> is used for concatenating binaries, strings are binaries
"concatenate" <> "strings"
```

## Charlist

A list of characters:

```elixir
'abcdefg'
char_list = 'abcdefg'
is_list(char_list) == true
Enum.each(char_list, fn x -> IO.puts(x) end)
```

## Sigils

Sigils are custom functions that work on text.
They are useful, and a means to extend the language.

```elixir
# Create a list of words
h ~w{}
~w(the cat sat on the mat)   # list with strings
~w(the cat sat on the mat)a  # list with atoms
~w(the cat sat on the mat)c  # list with charlists

# Create a regex
h ~r{}
my_regex = ~r/foo/
Regex.replace(my_regex, "foobar", "chill")
```

# Functions

Functions are defined by their name and arity (the number of input arguments).

## Anonymous functions

Anonymous function can be assigned to a variable.
Function can return functions, and can be used as arguments.
Functions are defined by their name and arity (the number of arguments a function has)

Example:

``` elixir
list = [1, 2, 3]
sum = fn list -> Enum.sum(list) end
sum.(list)
```

Single function can have multiple bodies.
I was blown away when I saw this at first.
The function body that matches the input argument is returned.
Conditional logic without if else statements!

``` elixir
fizz = fn 
  (0, 0, _) -> "FizzBuzz"
  (0, _, _) -> "Fizz"
  (_, 0, _) -> "Buzz"
  (_, _, c) -> c
end

IO.puts(fizz.(0, 1, 1))
IO.puts(fizz.(1, 0, 1))
IO.puts(fizz.(0, 0, 1))
IO.puts(fizz.(1, 1, 1))
```

Anonymous functions have a shorthand: 

```elixir
# Shorthand
fun1 = fn x -> x + 1 end 
fun2 = &(&1 + 1)

fun1.(1) == fun2.(1)  # 1 == 1

# You can capture functions
x = &IO.puts/1
x.("string")
```

## Named functions

Named functions have to be in modules:

```elixir
defmodule Times do
  def double(n) do
    n * 2
  end
end

defmodule Times do
  def double(n), do: n * 2
end

Times.double(2)
```

Functions can be pattern matched, it will try to match based on the function definition order.
This is a means to create conditional logic in your code, withouth if else statements.
Define from most specific to general

```elixir
defmodule Add do
  def add(n) when is_integer(n), do: n + n

  def add([x, y]), do: x + y

  def add({a, b}), do: a + b
end

Add.add(2)
Add.add([2, 3])
Add.add({2, 3})
Add.add([])     # error, no match found
```

You can clause guard with "when" first patternmatch then guard clauses. 
Check where guards can be used, its in quite a lot of places.

```elixir
defmodule Guard do
  def what_is(x) when is_number(x) do
    IO.puts "#{x} is a number"
  end

  def what_is(x) when is_list(x) do
    IO.puts "#{inspect(x)} is a list"
  end

  def what_is(x) when is_atom(x) do
    IO.puts "#{x} is an atom"
  end
end

Guard.what_is(99)
Guard.what_is(:cat)
Guard.what_is([1,2,3])
```

Functions with an !, will raise an exception if the function encounters an error:

```
h File.stream!
```

`defp` defines a private function which can only be used in the module.

With modules you can:

* Nest modules
* import into into modules: import "List, only: [flatten: 1]" where 1 is the arity
* alias other modules: "alias Other.Moduler, as: Other
* Modules can have attributes @author, they can be used as variables, look up how

# Conditional logic

The most important conditional logic in Elixir: `case`, `cond`, patternmatching on function arguments.

## case: matches values

The `case` statement matches values!

``` elixir
result1 = {:ok, "lets, go!"}
result2 = {:error, "lets, go!"}

case_example = fn pattern ->
  case pattern do
    {:ok, str} -> IO.puts(str)
      {:success, "we can continue"}
    _ -> IO.puts("whomp, whomp")  # _ matches anything
      {:faillure, ":("}
  end
end

case_example.(result1)
case_example.(result2)
```

## cond: matches conditions

`cond` matches conditions:

```elixir
x = 1
cond do 
  x == 1 -> "I am true"
  x != 1 -> "I am false"
  true -> :error  # a catch all, because it always matches
end

```

## with: traverse a matching chain

`with` keeps evaluating, and enters the do block if all patterns match
If not match return that pattern: for example {:error, "reason why failed"}

```elixir
with {:ok, name} <- {:ok, "banaan"},
     {:ok, login_id} <- {:ok, "banaan"} do
  %{name: name, login_id: login_id}
end
```

## if else/unless 

You have if and its inverse unless. For more than one else statement use `cond`.

``` elixir
compare_int = fn x ->
  if x >= 1 do
    :greater_than_or_equal_to_one
  else
    :less_than_one
  end
end

compare_int.(0)
```

# Processing collections

## Enum: eager

Enum is the go to library to process collections.
Enum is eager.

```elixir
h Enum
list = [1, 2, 3]
Enum.filter(list, &(&1 != 2))
```

## Stream: lazy

Streams are lazy, they only deliver the next item in line when requested. 

```elixir
my_stream = ["a", "b", "c", "d"]

my_stream 
  |> Stream.map(fn x -> x <> x end)  # <> concatenates binaries ( asequence of bits divisible by 8): strings are binaries
  |> Enum.take(1)

Stream.unfold(0, fn   # check: h Stream.unfold
  x -> {x,  x + 1}
end) 
  |> Stream.map(fn x -> x + x end)
  |> Enum.take(20)
```

## List comprehension

List comphrehension exists!

It evaluates all combinations of multiple input sequences.
If conditions is `true` do something and return the result.

``` elixir
for a <- 1..10, a  > 1 and a <= 4, do: a
for a when a < 5 <- 1..10, do: a

# Creative zip using list comprehension
my_zip =  fn(list1, list2) ->
  for {x_value, x_index} <- Enum.with_index(list1),
    {y_value, y_index} <- Enum.with_index(list2),
    x_index == y_index,
    into: [] do
  {x_value, y_value}
  end
end

my_zip.([1,2,3], [3,2,1])
```
