---
title: Linux/Mac command line tutorial
date: 2021-03-05
description: A short hands on tutorial to get you started on the command line
---

<style type="text/css">
td {
    padding:0 15px;
}
</style>


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

<h2 class="border-bottom mb-3 mt-5" id="introduction-to-linux">Introduction to Linux</h2>

<h3 id="introduction">Introduction</h3>

*The linux philosophy*: Many small programs that work together efficiently, with as goal usability and maintainability 

Linux is a kernel, the operating system is [GNU](https://www.gnu.org/home.en.html). But when people say Linux, they mean [Linux Kernel](https://en.wikipedia.org/wiki/Linux_kernel) + [GNU-utils](https://www.gnu.org/software/coreutils/), which are a set of programs that are very well known and widely used, such as `ls`. There are also other kernels such as the BSD kernel, with a similar set of tools comparable to the GNU-utils.

The Kernel manages: 

- System hardware such as the CPU and other input/output (IO)
- File system 
- Processes scheduling

<h3 id="file-system-overview">File system overview</h3>


| Folder      | Description | 
| :---       |    :-------------------  |
|`/`| Root of the file system         |
|`/bin`| Contains programs (binaries) |
|`/usr/bin`| Non essential programs |
|`/etc`| Contains system config files |
|`/tmp`| Stores temporary files |
|`/home`| Contains personal data of users |
|`/home/patrick`| Patricks home folder |

<h3 id="key-features-of-linux">Key features of Linux</h3>

- Comes with a package manager which installs and updates software from trusted sources. Updating the system is very easy.
- Very flexible: You can install desktops, GUI's, window managers etc on top of linux 
- Lightweight: You can make it as lightweight or bloated as you want
- [Free and open source](https://en.wikipedia.org/wiki/Free_and_open-source_software)

<h3 id="the-terminal-and-the-shell">The terminal and the shell</h3>

- The terminal is program that outputs text to user. Examples are: allacrity, iterm2, urxvt, st, putty and many more.
- Inside the terminal runs a shell, which is its own program which has certain functionalities such as: variables, functions, auto-completion.
- Examples of shells are: csh, zsh, bash, fish, bash is the most common, and often the one you encounter when you log onto a server.
- The shell runs as a REPL (Read Evaluate Print Loop, same as a console in R). It reads your input and evaluates it, prints the output, and lets you type in a new command.

<h2 class="border-bottom mb-3 mt-5" id="command-line-overview-the-essentials">Command line overview: the essentials</h2>

<h3 id="some-commands-to-start-with">Some commands to start with </h3>

| Command    | Description | 
| :---        |    :----   |
|`whoami` | Who are you? |
|`w` | Who is doing what |
|`uname -a` | Shows OS info | 
|`pwd` | Shows primary working directory | 
|`whatis nameOfprogram` | Shows what a program does | 

<h3 id="moving-on-the-command-line">Moving on the command line</h3>

| Command      | Description | 
| :---        |    :----   |
|` cd`| Change directory to home folder       |
|` cd ./somefolder`| Change directory to somefolder       |
|` cd ~/somefolder`| Change directory to some folder from homefolder (~/ can be used as reference to the home folder of the current user) |
|` cd ../`|  Change to the directory above the current directory |
|` cd ../../`|  Change to 2 directories above the current directory |
|` cd -`|  Go to the directory you were previously |
|` mv  ./file1 ./file2`| Move files from A to B, also to rename files  |
|` mkdir newdir`| Create a directory called newdir        |
|` rmdir emptydir`| Removes an empty directory called emptydir    |
|` cp  ./original ./copy`| Copies a file     |
|` cp -R ./folder ./copyOffolder`| Copies a folder recursively  |
|` rm ./file`| Removes a file |
|` rm ./file*`| Removes every file that starts with "file" |
|` rm -R ./folder`| Removes a folder recursively         |
|` rm -Rf`| Removes a folder recursively with FORCE (useful for folders with git repo's)  |

*Tip*: Press tab to auto-complete commands or paths when typing out paths.


<h3 id="list-files-and-directories">List files and directories</h3>

| Command      | Description | 
| :---        |    :----   |
|` ls` | List files in the current folder        |
|` ls -l` | Show a longer list        |
|` ls -a` | Show hidden files and folders      |
|` ls -lah`| Add human readability      |
|` ls -R` | List files Recusively recursively          |

<h3 id="file-permission-system">File permission system</h3>

 <img src="/ls.png" width="500"> 

| Command      | Description | 
| :---        |    :----   |
|` chmod +x`| Makes a file executable       |
|` sudo`| Execute a command as root user for full rights  |
|` sudo vim /etc/hosts` | Execute a command as root user for full rights, useful for installing programs, editing files that are not yours etc.  |

<h3 id="useful-commands">Useful commands</h3>

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

Bash has its own programming language, which is very similar to but not the same as the programming languages of other shells. Bash has support for variables, functions and control flow statements. Writing a script using a shell script language, is called shell scripting. The combination of shell scripting and pipes is very powerful and can be used to write short and powerful programs. The power lies in the fact that you can create an new programs by combining other programs that are in the /bin directory (or one of the other directories on the PATH variable)

Use aliases to create your own shortcuts (run your shortcuts as if they are programs in the /bin folder). Aliases are very powerful, they can refer to scripts that do non-trivial things. Example: `alias tu='top -o %CPU'`. You can put these aliases in your ~/.bashrc so they are sourced when you start your shell session.

<h3 id="example-of-shell-script">Example of shell script</h3>

Bash has its own scripting language, below is an example of a shell script:

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

