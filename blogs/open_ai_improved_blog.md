---
title: My first blog ever improved by OpenAI's ChatGPT
date: 2022-12-11
description: An improved Linux/Mac command line tutorial
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
    <img src="/serverroom.jpg" width="600" class="center">
</p>


<h2 class="border-bottom mb-3 mt-5">Content of this blog post</h2>

This blog post will include:

- My hot take on ChatGPT
    - Is it any good?
    - Consequences for the educational system
    - Consequences for society
    - Consequences for myself
- A case study where I let ChatGPT rewrite my first ever written blogpost.


I am really shocked and impressed by this AI and I do feel to need to give my hot take. It is most likely not that smart, nor orginal, but I hope at least it gets you thinking.

<h2 class="border-bottom mb-3 mt-5">My hot takes</h2>

#### Is it any good?

Absolutely yes, damm it is good. Is it better than you? Yes it's better than you. Will it replace you? Do you have a job where you are rehasing other peoples content? Then yes.
If you haven't tried ChatGPT out yet, I highly advise you to do so, or watch a YouTube video where someone else demonstrates it for you. I rewrote my first (terribly written) blog post and the results are fenominal. You can see it for yourself on this below.

#### Consequences for the educational system

I remember being in highschool and our math teacher told us: "you wont have a calculator in your pocket at any time of the day, so you better learn basic arithmetic". And I fully realize, that some extent, I will sound like that teacher when discussing the consequences a powerful AI such as this one will have on education. With this AI, students will be able to: write perfect english texts, commit plagiarism that will be extremely hard to detect, generate arguments for almost any non-current case, do coding exercises perfectly and much much more. I never learnt to do basic arithmetic  (and spelling for that matter), although a little embarrassing, it has not impacted my carreer in the slightest. Will this AI be the new calculator in your pocket?

So how will the availability to a powerful AI impact students ability to learn new skills? I believe that just like in the calculator case, if you rely on a "crutch" too much, you will never really learn that skill. The important question is: will it matter in the future? I have no idea, but the fact remains that it's just a matter of time we will have an AI as powerful as ChatGPT in our pockets, that we would be able to use all the time. I do however think that some skills will remain important even with ChatGPT in our pockets, skills such as: critical thinking, forming arguments, deduction and many more. ChatGPT is definitely able to demonstrate these skills in a written assignment. Students could use ChatGPT to make assignments and trick teachers into giving them a passing grade. I believe that students who leverage an AI too much will miss out on valuable learning opportunities, that otherwise could make them a better humans.


#### Consequences for society

Honestly, I really do find it too hard to say something really insightful about what consequences an AI like this will have on society. For that, check out some critical thinkers of this age.
Listen to Lex Fridman to get some positive vibes, listen to some Sam Harris for some negative vibes.

Having that said, here is my hot take. Some jobs will go away, some jobs will be created (I am not sure which ones but I am sure some jobs will be created because of this, maybe something like fake-news examiner). 
A list of jobs that come to mind that will either go away or radically change: 

- Content creation (unoriginal content creation, but also writing papers for academia)
- Some coding jobs
- Administrative jobs
- Customer service
- Life coach (looking at you Jeremy)

Also it will get extremely difficult to separate fake from real, that will have huge consequences in society, but enough is being said about this already.


#### Consequences for myself

So what will an AI do for me personally?
ChatGPT would make me way more productive. 
I could write more code and better code and have more time for other things that really matter.
I am quite happy that I am a generalist an never truly specialized, in for example, coding in frontend web frameworks. 
That is one of the first things I am going to use an AI for, and I am sure it will be great at it.

Also, my writing is terrible, I would be able to improve massively in that area as well. 

Overall I think my production would be way up: ChatGPT will handle all the details and leave me to decide what the bigger picture (for now at least) should look like, so from now on that is where I will focus my carreer on.

I dread however the reliance on yet another big tech company.

<h2 class="border-bottom mb-3 mt-5">Rewriting my first blog with ChatGPT</h2>

Below you can find the `diff` between my first blog post written ever, and the improved version with ChatGPT. It is amazing what it could do: it rewrote complete sections, it rewrote tables keeping the table structure in tact and it added missing content to tables (relevant to the context!). I think my first blog post is especially well suited to be rewritten be ChatGPT because it is just a currated collection of very well known (and old) programs. A lot has been written about these programs already, and these text have been included in the trainingset.

Could you use ChatGPT to write this blog from scratch? Absolutely, but you do have to ask the right questions and steer the AI towards answer you think is right! In my case found ChatGPT to be somewhat general and verbose, but I was able to correct it and steer the content in the way I had in mind. 

At some point in the rewrite I was not allowed to use ChatGPT anymore :( a huge bummer. 

Unrelated to the rewritten blog, I asked ChatGPT all kinds of social, business related and ethical questions and it came up with remarkable, albeit, somewhat general answers. 
If you are in the business of dealing well articulated, common sense, 2 clicks away on the internet knowledge, you will have steep competition. The huge problem with ChatGPT is of course you don't know whether it told you the truth. With low stakes problems, such as, how to orient mouse traps with respect to walls, I would trust ChatGPT, but other problems (how to develop a fair fraud detection model for an issurance company) I wouldn't, although it gave an amazing answer as well.


<h2 class="border-bottom mb-3 mt-5">The new and improved blog by ChatGPT</h2>

The questions I asked ChatGPT are included.

<h2 class="border-bottom mb-3 mt-5" id="table-of-contents">Table of contents</h2>

* [Introduction to Linux](#introduction-to-linux)
    * [Introduction](#introduction)
    * [File system overview](#file-system-overview)
    * [Key features of Linux](#key-features-of-linux)
    * [The terminal and the shell](#the-terminal-and-the-shell)
* [Command line overview: the essentials](#command-line-overview-the-essentials)
    * [Some commands to start with](#some-commands-to-start-with)
    * [Moving on the command line](#moving-on-the-command-line)
    * [List files and directories](#list-files-and-directories)
    * [File permission system](#file-permission-system)
    * [Useful commands](#useful-commands)
    * [Pipes](#pipes)
    * [Remote access](#remote-access)
* [Bash and shell scripting with bash](#bash-and-shell-scripting-with-bash)
    * [Introduction](#introduction-1)
    * [Example of shell script](#example-of-shell-script)

<h2 class="border-bottom mb-3 mt-5" id="introduction-to-linux">Introduction to the command line</h2>

<h3 id="introduction">Introduction</h3>

```
I decided to have a new introduction, so I asked:
Why should one learn the command line?
```

Learning the command line is very valuable skill, and you should learn it for these reasons. First and foremost, the command line allows users to access and control their computer or server in a much more powerful and flexible way than is possible with a graphical user interface. For example, users can easily automate repetitive tasks, combine multiple commands to perform complex operations, and access a wide range of advanced features and settings. Additionally, the command line is often the only way to access certain tools and services, particularly on servers or other headless systems. Learning the command line can also help users become more efficient and productive, since they can use keyboard shortcuts and other techniques to perform tasks more quickly. Finally, knowing the command line can be a valuable skill for anyone working in technology, since many tools and services are accessed and controlled via the command line.


```
I want to help my readers in learning the command line in the best possible way, so I asked:
What is the best way of learning the command line?

I did not like the answer, so I asked:
Explain why the best way of learning the command line is by starting to use simple commands, and see what they do.
```

One of the best ways to learn the command line is by starting to use simple commands and seeing what they do. This approach has several advantages. First, it allows you to learn the basics of how the command line works and get a feel for how to enter and run commands. This is important, because the command line can be intimidating for people who are new to it. By starting with simple commands, you can gradually build your confidence and familiarity with the command line. Second, using simple commands allows you to see the results of your actions immediately, which can be a very effective learning tool. This can help you understand how the command line works and how different commands are used. Finally, using simple commands allows you to experiment and explore the command line in a safe and controlled way. This can help you discover new features and capabilities, and can also provide a basis for more advanced learning and exploration.

```
I added a new paragraph here myself:
```

In order to be efficient with the command line it's very useful to have some basic knowledge about linux, and you need to know some basic command. In this tutorial I am going to provide you with exactly that, in order to get you going in no-time!


<h3 id="the-terminal-and-the-shell">The terminal, the shell and the REPL</h3>

The command line is used inside a program that is called a terminal emulator (or just the terminal, although there is a difference).

```
To rewrite this section I asked:
improve this summary of the terminal and a shell: <old-section>
```

The terminal is a program that allows users to interact with their computer or server using text-based commands. The terminal outputs the results of these commands in the form of text, which the user can read and respond to. There are many different terminal programs available, including gnome-terminal, iterm2, urxvt, alacritty, and putty.

Inside the terminal runs a shell, which is a separate program that provides a range of additional features and capabilities. The shell is responsible for interpreting and executing the commands that the user enters in the terminal. This includes handling things like variables, functions, and auto-completion. There are many different shells available, including csh, zsh, bash, and fish. Bash is the most common shell, and is often the default shell on Linux and other Unix-like operating systems.

The shell runs in a REPL (Read Evaluate Print Loop) mode, which means that it reads the user's input, evaluates it, prints the output, and then wait's for the user to enter a new command. This is similar to the way a console works in programming languages like R. By using the terminal and the shell together, users can perform a wide range of tasks, from running programs and managing files to accessing advanced features and settings.


<h2 class="border-bottom mb-3 mt-5" id="command-line-overview-the-essentials">Command line overview: the essentials</h2>

<h3 id="some-commands-to-start-with">Some commands to start with </h3>

```
To improve the description in this table I asked:
Improve the description of these commands: <paste table>
```
  
| Command    | Description | 
| :---        |    :----   |
| `whoami` |	Displays the current user's username |
| `w` |	Displays a list of users currently logged in to the system, along with information about what they are doing |
| `uname -a` |	Shows detailed information about the current operating system, including it's name, version, and patch level |
| `pwd` |	Displays the path of the current working directory |
| `whatis nameOfprogram` |	Displays a brief description of the specified program, including it's purpose and functionality |

<h3 id="moving-on-the-command-line">Moving on the command line</h3>

```
To improve the description in this table I asked:
Improve the description of these commands: <paste table>
```

| Command      | Description | 
| :---        |    :----   |                                                                                  
|` cd`| Change the current working directory to the user's home directory |
|` cd ./somefolder`| somefolder	Change the current working directory to the "somefolder" directory within the current directory |
|` cd ~/somefolder`| somefolder	Change the current working directory to the "somefolder" directory within the user's home directory (~/ can be used as a shortcut for the home directory) |
|` cd ../`| Change the current working directory to the parent directory of the current directory |
|` cd ../../`| Change the current working directory to the grandparent directory of the current directory (i.e., two levels above the current directory) |
|` cd -`| Change the current working directory to the previous directory (i.e., the directory you were in before the last "cd" command) |
|` mv  ./file1 ./file2`| Move or rename a file from the "file1" location to the "file2" location |
|` mkdir newdir`| Create a new directory called "newdir" |
|` rmdir emptydir`| Remove an empty directory called "emptydir" |
|` cp  ./original ./copy`| Create a copy of the "original" file in a new file called "copy" |
|` cp -R ./folder ./copyOffolder`| Recursively copy the contents of the "folder" directory to a new directory called "copyOfFolder" |
|` rm ./file`| Remove the file called "file" |
|` rm ./file*`| Remove all files in the current directory that start with "file" |
|` rm -R ./folder`| Recursively remove the contents of the "folder" directory, including any subdirectories and files within it |
|` rm -Rf`| Forcefully remove the contents of the "folder" directory, including any subdirectories and files within it (useful for removing directories that contain a git repository) |

*Tip*: Press tab to auto-complete commands or paths when typing out paths.

<h3 id="list-files-and-directories">List files and directories</h3>

```
I asked:
Improve the commands in this paragraph, also include useful commands that I might have forgotten.
```
| Command      | Description | 
| :---        |    :----   |                                                                                  
|ls	| List the files and directories in the current working directory |
|ls -l |	Show a detailed, long listing of the files and directories in the current working directory, including their sizes, permissions, and modification dates |
|ls -a |	Show all files and directories in the current working directory, including hidden files and directories that are normally not displayed |
|ls -lah | Show a detailed, long listing of the files and directories in the current working directory, including their sizes, permissions, and modification dates, and display the sizes in a human-readable format (e.g., 1K, 234M, etc.) |
|ls -R |	List the files and directories in the current working directory and all of it's subdirectories recursively |

Some other useful commands for listing files and directories include:

| Command      | Description | 
| :---        |    :----   |                                                                                  
|tree | Display the directory structure of a directory as a tree |
|find | Search for files and directories based on various criteria (e.g., name, size, permissions, etc.) |
|du | Show the sizes of directories and their contents, including the total size of each directory |
|stat | Display detailed information about a file or directory, including it's inode number, permissions, size, and other metadata. |
|file | Determine the type of a file based on it's content, rather than it's name or extension. |


<h3 id="file-permission-system">File permission system</h3>

 <img src="/ls.png" width="500"> 

| Command      | Description | 
| :---        |    :----   |
|` chmod +x` | Makes a file executable       |
|` sudo` | Execute a command as root user for full rights  |
|` sudo vim /etc/hosts` | Execute a command as root user for full rights, useful for installing programs, editing files that are not yours etc.  |

<h3 id="useful-commands">Useful commands</h3>

```
OpenAI did not let me improve any further :( which is a huge bummer
```

| Command      | Description | 
| :---        |    :----   |
|`less`| Less is a pager, which is a useful program to read text files with. scroll text up/down with j/k, seach with "/", quit with q, see `man less` for the full documentation |
|`man ls`| This is the most useful command, and is often under utilized. It opens the manual of any program, if available, in a pager that functions the same as the less program  |
|`top`| View all running processes |
|`top -o %CPU`| Sort by CPU usage |
|`top -o %MEM`| Sort by memory usage |
|`kill PID`| Kill a process with PID (process ID) number |
|`pkill firefox`| Kill all processes matching the name firefox |
|`echo "hi"`| Outputs the string "hi" to standard out (Can be redirected using pipes) |
|`yes`| Output a string repeatedly until killed |
|`Control + C`| Key combination to press in order to kill a running program |
|`nano`| A "userfriendly" text editor  |
|`ps -aux`| Outputs processes of all users |
|`grep` | Print lines that match patterns |
|`history`| Outputs a history of all run commands |
|`history \| grep command` | Find the specifics of a command that matches the string "command" |
|`cat file1 file2` | Concatenates the output of 2 files, is often used to output a file to standard out |
|`head`| Shows the first 10 lines of a file |
|`tail`| Shows the last 10 lines of a file |
|`exit`| Exit the current terminal, useful if you are going from one shell to the other using ssh |
|`clear`| Clear the screen (Control + L) |
|`touch`| Change the modification date of a file, if the file does not exist, create it |
|`touch file{1..10}`| Creates 10 files: file1 ... file10 |
|`find . -name '*.pdf' -type f`| Find all pdf files in the current folder recusively |
|`file`| Determines the file type |
 
<h3 id="pipes">Pipes</h3>

Extremely useful and often used. Can be used to chain programs together that are on PATH variable (run `echo $PATH` so see all the directories that bash can use programs from, run `env` to see all variables that are currently in the bash environment) 

| Command      | Description | 
| :---        |    :----   |
|`ls -la \| less` |  View the output of the ls command in the less pager                  |
|`history \| grep ssh \| wc -l` | Count how many times the ssh program has been execute       |
|`ls -R ~/ > bigFile.txt`| Stream the output of the ls command the file bigFile.txt         |
|`cat bigFile.txt \| wc -l` | Count the lines of bigFile        |

use `|` to stream the output of a program to the input of a program 

use `>>` for appending to a file \
`echo "I want to append my file with this string" >> myfile`

use `>` for overwriting the file, it gives no warnings \
`echo "I want to overwrite my file with this string" > myfile`

use `<` for reading from a file \
`less < bigFile.txt`


<h3 id="remote-access">Remote access</h3>

| Command      | Description | 
| :---        |    :----   |
|`ping www.google.nl`|  See if you can reach a host (www.google.nl is translated to an ipaddr) from current shell |
|`ping ipaddr`|  See if you can reach a host matching: ipaddr  |
|`ping hostname`|  See if you can reach a host matching: hostname, the hostname is linked to an ipaddr  |
|`ssh 192.168.0.1`| Remote login to a host with ip adress: 192.168.0.1 |
|`ssh user@192.168.0.1`| Remote login to a host with ip adress: 192.168.0.1 as the user: user |

<h2 class="border-bottom mb-3 mt-5" id="bash-and-shell-scripting-with-bash">Bash and shell scripting with bash</h2>

<h3 id="introduction">Introduction</h3>

Bash is often the default shell when you log onto a system. The config file of bash is stored in a file called ~/.bashrc, when starting up a terminal with bash as the shell, the contents in ~/.bashrc are loaded (sourced), in your ~/.bashrc you can set your own settings. 

Bash has it's own programming language, which is very similar to but not the same as the programming languages of other shells. Bash has support for variables, functions and control flow statements. Writing a script using a shell script language, is called shell scripting. The combination of shell scripting and pipes is very powerful and can be used to write short and powerful programs. The power lies in the fact that you can create an new programs by combining other programs that are in the /bin directory (or one of the other directories on the PATH variable)

Use aliases to create your own shortcuts (run your shortcuts as if they are programs in the /bin folder). Aliases are very powerful, they can refer to scripts that do non-trivial things. Example: `alias tu='top -o %CPU'`. You can put these aliases in your ~/.bashrc so they are sourced when you start your shell session.

<h3 id="example-of-shell-script">Example of shell script</h3>

Bash has it's own scripting language, below is an example of a shell script:

```bash
#!/bin/bash

# The first line of the script tells the OS
# that the script has the be execute with bash.
# Bash is also a program. Try executing bash inside bash.

# Define the variable COUNTER and set to 1
COUNTER=1

while true; do

    # Append a string to the file called counter.log
    echo "Dit is mijn counter: ""$COUNTER" >> counter.log

    # Add one to counter
    COUNTER=$((COUNTER+1))

    # Let the CPU sleep for half a second
    sleep 0.5;

done & echo "Process has been send to the background, please kill me! run: kill ""$!"

# Note: the ampersand sends a program to the background and frees up the terminal. 
# Do not forget to kill it
```

To run this script, make it executable: `chmod +x ./myscript.sh`. Then you can run the program as follows: `$ /path/to/myscript.sh`. This script is appending a new line to a file called `counter.log`, a file which has been created by the script in the folder from where the script is run. Try executing `tail -f counter.log` on the file to see what happens. To see what the `-f` flag is doing, run: `man tail`.


See [this overview](https://tldp.org/HOWTO/Bash-Prog-Intro-HOWTO.html) for more an extensive overview of bash.

*Tip*: You can run shell commands from with `python` and `R` (In `R` this can be done with the `system()` function)


<h2 class="border-bottom mb-3 mt-5">The difference between the old and the new</h2>

Below you can find the `diff` between the old and the improved blog. You can see for yourself how ChatGPT did.

<div class="force-word-wrap">

``` diff
diff --git a/tutorial.md b/open_ai_improved_blog.md
index f9671cf..6cf62fb 100644
--- a/tutorial.md
+++ b/open_ai_improved_blog.md
@@ -1,7 +1,7 @@
 ---
-title: Linux/Mac command line tutorial
-date: 2021-03-05
-description: A short hands on tutorial to get you started on the command line
+title: My first blog improved by OpenAI 
+date: 2022-12-12
+description: Improved blog; Linux/Mac command line tutorial
 ---
 
 <style type="text/css">
@@ -30,91 +30,119 @@ td {
     * [Introduction](#introduction-1)
     * [Example of shell script](#example-of-shell-script)
 
-<h2 class="border-bottom mb-3 mt-5" id="introduction-to-linux">Introduction to Linux</h2>
+<h2 class="border-bottom mb-3 mt-5" id="introduction-to-linux">Introduction to the command line</h2>
 
 <h3 id="introduction">Introduction</h3>
 
-*The linux philosophy*: Many small programs that work together efficiently, with as goal usability and maintainability 
+``
+I decided to have a new introduction, so I asked:
+Why should one learn the command line?
+``
 
-Linux is a kernel, the operating system is [GNU](https://www.gnu.org/home.en.html). But when people say Linux, they mean [Linux Kernel](https://en.wikipedia.org/wiki/Linux_kernel) + [GNU-utils](https://www.gnu.org/software/coreutils/), which are a set of programs that are very well known and widely used, such as `ls`. There are also other kernels such as the BSD kernel, with a similar set of tools comparable to the GNU-utils.
+Learning the command line is very valuable skill, and you should learn it for these reasons. First and foremost, the command line allows users to access and control their computer or server in a much more powerful and flexible way than is possible with a graphical user interface. For example, users can easily automate repetitive tasks, combine multiple commands to perform complex operations, and access a wide range of advanced features and settings. Additionally, the command line is often the only way to access certain tools and services, particularly on servers or other headless systems. Learning the command line can also help users become more efficient and productive, since they can use keyboard shortcuts and other techniques to perform tasks more quickly. Finally, knowing the command line can be a valuable skill for anyone working in technology, since many tools and services are accessed and controlled via the command line.
 
-The Kernel manages: 
 
-- System hardware such as the CPU and other input/output (IO)
-- File system 
-- Processes scheduling
+``
+I want to help my readers in learning the command line in the best possible way, so I asked:
+What is the best way of learning the command line?
 
-<h3 id="file-system-overview">File system overview</h3>
+I did not like the answer, so I asked:
+Explain why the best way of learning the command line is by starting to use simple commands, and see what they do.
+``
 
+One of the best ways to learn the command line is by starting to use simple commands and seeing what they do. This approach has several advantages. First, it allows you to learn the basics of how the command line works and get a feel for how to enter and run commands. This is important, because the command line can be intimidating for people who are new to it. By starting with simple commands, you can gradually build your confidence and familiarity with the command line. Second, using simple commands allows you to see the results of your actions immediately, which can be a very effective learning tool. This can help you understand how the command line works and how different commands are used. Finally, using simple commands allows you to experiment and explore the command line in a safe and controlled way. This can help you discover new features and capabilities, and can also provide a basis for more advanced learning and exploration.
 
-| Folder      | Description | 
-| :---       |    :-------------------  |
-|`/`| Root of the file system         |
-|`/bin`| Contains programs (binaries) |
-|`/usr/bin`| Non essential programs |
-|`/etc`| Contains system config files |
-|`/tmp`| Stores temporary files |
-|`/home`| Contains personal data of users |
-|`/home/patrick`| Patricks home folder |
+``
+I added a new paragraph here myself:
+``
 
-<h3 id="key-features-of-linux">Key features of Linux</h3>
+In order to be efficient with the command line it's very useful to have some basic knowledge about linux, and you need to know some basic command. In this tutorial I am going to provide you with exactly that, in order to get you going in no-time!
 
-- Comes with a package manager which installs and updates software from trusted sources. Updating the system is very easy.
-- Very flexible: You can install desktops, GUI's, window managers etc on top of linux 
-- Lightweight: You can make it as lightweight or bloated as you want
-- [Free and open source](https://en.wikipedia.org/wiki/Free_and_open-source_software)
 
-<h3 id="the-terminal-and-the-shell">The terminal and the shell</h3>
+<h3 id="the-terminal-and-the-shell">The terminal, the shell and the REPL</h3>
+
+The command line is used inside a program that is called a terminal emulator (or just the terminal, although there is a difference).
+
+``
+To rewrite this section I asked:
+improve this summary of the terminal and a shell: <old-section>
+``
+
+The terminal is a program that allows users to interact with their computer or server using text-based commands. The terminal outputs the results of these commands in the form of text, which the user can read and respond to. There are many different terminal programs available, including gnome-terminal, iterm2, urxvt, alacritty, and putty.
+
+Inside the terminal runs a shell, which is a separate program that provides a range of additional features and capabilities. The shell is responsible for interpreting and executing the commands that the user enters in the terminal. This includes handling things like variables, functions, and auto-completion. There are many different shells available, including csh, zsh, bash, and fish. Bash is the most common shell, and is often the default shell on Linux and other Unix-like operating systems.
+
+The shell runs in a REPL (Read Evaluate Print Loop) mode, which means that it reads the user's input, evaluates it, prints the output, and then wait's for the user to enter a new command. This is similar to the way a console works in programming languages like R. By using the terminal and the shell together, users can perform a wide range of tasks, from running programs and managing files to accessing advanced features and settings.
 
-- The terminal is program that outputs text to user. Examples are: allacrity, iterm2, urxvt, st, putty and many more.
-- Inside the terminal runs a shell, which is it's own program which has certain functionalities such as: variables, functions, auto-completion.
-- Examples of shells are: csh, zsh, bash, fish, bash is the most common, and often the one you encounter when you log onto a server.
-- The shell runs as a REPL (Read Evaluate Print Loop, same as a console in R). It reads your input and evaluates it, prints the output, and lets you type in a new command.
 
 <h2 class="border-bottom mb-3 mt-5" id="command-line-overview-the-essentials">Command line overview: the essentials</h2>
 
 <h3 id="some-commands-to-start-with">Some commands to start with </h3>
 
+``
+To improve the description in this table I asked:
+Improve the description of these commands: <paste table>
+``
+  
 | Command    | Description | 
 | :---        |    :----   |
-|`whoami` | Who are you? |
-|`w` | Who is doing what |
-|`uname -a` | Shows OS info | 
-|`pwd` | Shows primary working directory | 
-|`whatis nameOfprogram` | Shows what a program does | 
+| `whoami` |	Displays the current user's username |
+| `w` |	Displays a list of users currently logged in to the system, along with information about what they are doing |
+| `uname -a` |	Shows detailed information about the current operating system, including it's name, version, and patch level |
+| `pwd` |	Displays the path of the current working directory |
+| `whatis nameOfprogram` |	Displays a brief description of the specified program, including it's purpose and functionality |
 
 <h3 id="moving-on-the-command-line">Moving on the command line</h3>
 
+``
+To improve the description in this table I asked:
+Improve the description of these commands: <paste table>
+``
+
 | Command      | Description | 
-| :---        |    :----   |
-|` cd`| Change directory to home folder       |
-|` cd ./somefolder`| Change directory to somefolder       |
-|` cd ~/somefolder`| Change directory to some folder from homefolder (~/ can be used as reference to the home folder of the current user) |
-|` cd ../`|  Change to the directory above the current directory |
-|` cd ../../`|  Change to 2 directories above the current directory |
-|` cd -`|  Go to the directory you were previously |
-|` mv  ./file1 ./file2`| Move files from A to B, also to rename files  |
-|` mkdir newdir`| Create a directory called newdir        |
-|` rmdir emptydir`| Removes an empty directory called emptydir    |
-|` cp  ./original ./copy`| Copies a file     |
-|` cp -R ./folder ./copyOffolder`| Copies a folder recursively  |
-|` rm ./file`| Removes a file |
-|` rm ./file*`| Removes every file that starts with "file" |
-|` rm -R ./folder`| Removes a folder recursively         |
-|` rm -Rf`| Removes a folder recursively with FORCE (useful for folders with git repo's)  |
+| :---        |    :----   |                                                                                  
+|` cd`| Change the current working directory to the user's home directory |
+|` cd ./somefolder`| somefolder	Change the current working directory to the "somefolder" directory within the current directory |
+|` cd ~/somefolder`| somefolder	Change the current working directory to the "somefolder" directory within the user's home directory (~/ can be used as a shortcut for the home directory) |
+|` cd ../`| Change the current working directory to the parent directory of the current directory |
+|` cd ../../`| Change the current working directory to the grandparent directory of the current directory (i.e., two levels above the current directory) |
+|` cd -`| Change the current working directory to the previous directory (i.e., the directory you were in before the last "cd" command) |
+|` mv  ./file1 ./file2`| Move or rename a file from the "file1" location to the "file2" location |
+|` mkdir newdir`| Create a new directory called "newdir" |
+|` rmdir emptydir`| Remove an empty directory called "emptydir" |
+|` cp  ./original ./copy`| Create a copy of the "original" file in a new file called "copy" |
+|` cp -R ./folder ./copyOffolder`| Recursively copy the contents of the "folder" directory to a new directory called "copyOfFolder" |
+|` rm ./file`| Remove the file called "file" |
+|` rm ./file*`| Remove all files in the current directory that start with "file" |
+|` rm -R ./folder`| Recursively remove the contents of the "folder" directory, including any subdirectories and files within it |
+|` rm -Rf`| Forcefully remove the contents of the "folder" directory, including any subdirectories and files within it (useful for removing directories that contain a git repository) |
 
 *Tip*: Press tab to auto-complete commands or paths when typing out paths.
 
-
 <h3 id="list-files-and-directories">List files and directories</h3>
 
+``
+I asked:
+Improve the commands in this paragraph, also include useful commands that I might have forgotten.
+``
 | Command      | Description | 
-| :---        |    :----   |
-|` ls` | List files in the current folder        |
-|` ls -l` | Show a longer list        |
-|` ls -a` | Show hidden files and folders      |
-|` ls -lah`| Add human readability      |
-|` ls -R` | List files Recusively recursively          |
+| :---        |    :----   |                                                                                  
+|ls	| List the files and directories in the current working directory |
+|ls -l |	Show a detailed, long listing of the files and directories in the current working directory, including their sizes, permissions, and modification dates |
+|ls -a |	Show all files and directories in the current working directory, including hidden files and directories that are normally not displayed |
+|ls -lah | Show a detailed, long listing of the files and directories in the current working directory, including their sizes, permissions, and modification dates, and display the sizes in a human-readable format (e.g., 1K, 234M, etc.) |
+|ls -R |	List the files and directories in the current working directory and all of it's subdirectories recursively |
+
+Some other useful commands for listing files and directories include:
+
+| Command      | Description | 
+| :---        |    :----   |                                                                                  
+|tree | Display the directory structure of a directory as a tree |
+|find | Search for files and directories based on various criteria (e.g., name, size, permissions, etc.) |
+|du | Show the sizes of directories and their contents, including the total size of each directory |
+|stat | Display detailed information about a file or directory, including it's inode number, permissions, size, and other metadata. |
+|file | Determine the type of a file based on it's content, rather than it's name or extension. |
+
 
 <h3 id="file-permission-system">File permission system</h3>
 
@@ -122,12 +150,16 @@ The Kernel manages:
 
 | Command      | Description | 
 | :---        |    :----   |
-|` chmod +x`| Makes a file executable       |
-|` sudo`| Execute a command as root user for full rights  |
+|` chmod +x` | Makes a file executable       |
+|` sudo` | Execute a command as root user for full rights  |
 |` sudo vim /etc/hosts` | Execute a command as root user for full rights, useful for installing programs, editing files that are not yours etc.  |
 
 <h3 id="useful-commands">Useful commands</h3>
 
+``
+OpenAI did not let me improve any further :( which is a huge bummer
+``
+
 | Command      | Description | 
 | :---        |    :----   |
 |`less`| Less is a pager, which is a useful program to read text files with. scroll text up/down with j/k, seach with "/", quit with q, see `man less` for the full documentation |
```

</div>
