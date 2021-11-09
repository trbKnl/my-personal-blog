---
title: Turn Neovim into a Python IDE
date: 2021-11-09
description: A set of vim functions to send Python code to the interpreter
---

<style type="text/css">
td {
    padding:0 15px;
}
</style>

<p style="text-align:center;">
 <img src="/vimide.png" width="700" class="center"> 
</p>


<h3 class="border-bottom mb-3 mt-5">Goal of this blog post</h3>

Vim is a fun tool to edit code and plain text with. But it lacks an included interpreter that IDE's usually have. It is a very handy, to be able to send code to an interpreter to see whether it works or not. 
Vim lacks this functionality by default, but it can be easily "hacked" in. In this blog post I will give some pointers on how to turn Neovim into a very powerful Python IDE. I will discuss:

* A couple of Vim functions (that only work with Neovim) to add interpreter functionality
* Name some Vim packages that aim to do the same thing 
* Discuss other functionalities you might want for your custom IDE

In this blog post you will learn some Vimscript and maybe get some ideas on how to turn Neovim into a custom IDE you will enjoy.

<h3 class="border-bottom mb-3 mt-5">Send lines to a Python interpreter</h3>

The essential thing I want in a Python IDE is to use Vim hotkeys (Which a lot of IDE's already provide such as: JupyterLab, R-Studio, VSCode and probably many others) and to send code to an interpreter. 

Vim hotkeys are a given in Neovim, and Neovim makes it fairly easy to add the interpreter functionality. [Neovim](https://neovim.io/) *"is a Vim-based text editor engineered for extensibility and usability, to encourage new applications and contributions."*

In this section I will present a couple of Vimscript functions that make use of Neovim functionality that add a Python interpreter.

The general idea is to open a terminal in a new vim split that runs a Python interpreter that is able to receive lines. First I will discuss some functions that do the trick, and then we will map these functions to keystrokes, so we can use them conveniently. I will discuss these functions in detail so you can modify them or change them if you like. 

#### Open a terminal and start a Python interpreter

This following function opens a new vimsplit and starts a Python interpreter: 

```
function StartPython()
    " Opens new split, starts the interpreter in a nvim terminal and store the channel id
    " Store the buffer id, so it can be killed later
    " Move cursor to end of line for auto scroll
    " Move back to previous split
    vs enew | let g:channel_id = termopen('python')
    let g:buf_nr = bufnr('%')
    execute 'normal! G'
    wincmd p
endfunction
```

This function opens a vimsplit with `vs` and in this split opens a terminal with `termopen()` (this function is specific to Neovim), when opening the terminal the command `python` is run. In my case `python` starts a Python 3 interpreter. `termopen()` returns a channel id, I store this id in a global variable called `g:channel_id` (which is accessible to other vim functions), we need this id if we want to send lines to the terminal.

#### Send lines to the terminal

Next we need a function to send lines to the interpreter. For this we can use the function `chansend()` which sends a line to a terminal window, identified with its id number.
So python uses indentation to tell the interpreter certain code belongs together. We need to take this into account when sending lines to the interpreter.

The following function sends a line to the terminal window and puts the cursor on the next line:

```
" Global variables
" Record whether you have seen a blank line or not
let g:seen_blank = 0

function SendLineTermBuf()
    " Grabs current line with getline, then process it, and send it to
    " to the running the terminal. Move to the next line.
    "
    " If the line is blank, do not send it to the terminal buffer, unless it
    " is the second line, it may indicate the end of a function declaration.
    " If the line is non-blank, send it to the terminal buffer, if the
    " previous line was blank, send an extra line, it might be needed
    " to indicate the end of a function declaration.
    let input = getline('.')
    if input == ''
        if g:seen_blank
            call chansend(g:channel_id, "\r")
        else
            let g:seen_blank = 1
        endif
    else
        if input =~ '\m\C^\S.*' && g:seen_blank
            call chansend(g:channel_id, "\r")
            call chansend(g:channel_id, input."\r") " The dot joins 2 strings
        else
            call chansend(g:channel_id, input."\r")
        endif
        let g:seen_blank = 0
    endif
    execute 'normal! j0'
endfunction
```

The flow of the function is as follows:

1. Get a line
2. Check if its a blank line then:
    1. If the previous line was also blank, send a new line. Indicating the possible end of a function declaration.
    2. If the previous line was *not* blank, than do not send a new line. But remember that you have seen a blank line. I do this, so you can have a blank lines in the code where you declare a function. Otherwise, a blank line would immediately indicate the end of a function declaration.
3. If the line is not blank then send that line to the interpreter
    1. Here I check an edge case where you might want to send an extra line break. You want this when a function declaration ends, and you have just one line separating the next function declaration. 
4. Put the cursor on the next line, ready to be processed again


#### Map the function to a keystroke

Now we have our functions, we can map them to keystrokes for easy use. We can do that with the `map` command, which maps a set of key presses to other key presses.

We can map our functions as follows:

```
nmap <leader>s :call StartPython()<CR>
nmap <space> :call SendLineTermBuf()<CR>
```

The first line maps `<leader>s` (I set the leader key to `,`) to the keystrokes `:call StartPython()<CR>` when you are in normal mode. Which calls the function, and executes its by simulating a carriage return.

The second line maps a key press of the space bar to `:call SendLineTermBuf()<CR>`. I personally love this mapping, because you get to ram the space bar over and over (or you can keep holding it).

Sometimes you want to send code to the interpreter in visual mode, I also included a function for this. The function is very similar so I wont go over it in detail, all the code is included at the end of this page.


#### How to get this code to work when starting Neovim?

I could have put this code in a package for you to download, but I am too lazy for this. So what I do is I `:source /path/to/the/script.vim` which loads the functions and keymappings when I need them. 

If you do not want to do that, you can put the code into your `.vimrc` or whatever your Neovim uses and load it when you start Neovim.


<h3 class="border-bottom mb-3 mt-5">Further tips to pimp your Neovim</h3>

With these functions in place you have a very capable code editor with a Python interpreter. Because I use vim splits you have to know how to work with vim splits, see `:help split`.

Another commonly wanted feature of IDE's is an included file browser, I do not really care for that, so I can't give you any tips. But I know Vim has got some great options, [Nerdtree](https://github.com/preservim/nerdtree) is one of them.

Another feature of an IDE is code completion and such. I used [YouCompleteMe](https://github.com/ycm-core/YouCompleteMe) for a very long time, I really liked it, then I switched to [Conquer of Completion](https://github.com/neoclide/coc.nvim) and I liked that one even more. Both are great options.

<h3 class="border-bottom mb-3 mt-5">Plugins that do the same thing</h3>

Other plugins that do the same thing are:

* [Nvim-R](https://github.com/jalvesaq/Nvim-R). Specifically written for R, works great, used it a lot 10/10 would recommend. For R definitely check this one out (You can also edit the code presented here for to work for R, that is also fairly trivial).
* [vimcmdline](https://github.com/jalvesaq/vimcmdline). By the same author as Nvim-R, but general purpose. I did not like it for Python, so I made this.


<h3 class="border-bottom mb-3 mt-5">All the code</h3>

Here's all the code:

```
" Global variables
let g:seen_blank = 0

function StartPython()
    " Opens new split, starts the interpreter in a nvim terminal and store the channel id
    " Store the buffer id, so it can be killed later
    " Move cursor to end of line for auto scroll
    " Move back to previous split
    vs enew | let g:channel_id = termopen('python')
    let g:buf_nr = bufnr('%')
    execute 'normal! G'
    wincmd p
endfunction

function KillPython()
    " Kill last opened buffer with StartPython
    execute "bd! " . g:buf_nr
endfunction


function SendLinesTermBuf()
    " Grabs text selection with getline, then process the lines and collect in a list,
    " send the list to the running the terminal.
    "
    " For each line in the selection: if the line is empty, do not add it to
    " the output list, unless the previous line was empty, then it may indicate the end of
    " a function declaration. If the line is non-empty add it to the list. If
    " the previous line was empty, and the line begins with a
    " non-whitespace char, it might indicate the end of a function declaration, so add an
    " extra line to the output list.
    let g:seen_blank = 0
    let input = getline("'<","'>")
    let output = []
    for line in input
        if line == ''
            if g:seen_blank
                call add(output, '')
            else
                let g:seen_blank = 1
            endif
        else
            if line =~ '\m\C^\S.*' && g:seen_blank
                call add(output, '')
                call add(output, line)
            else
                call add(output, line)
            endif
            let g:seen_blank = 0
        endif
    endfor
    call add(output, '')
    call add(output, '')
    call chansend(g:channel_id, output)
endfunction


function SendLineTermBuf()
    " Grabs current line with getline, then process it, and send it to
    " to the running the terminal. Move to the next line.
    "
    " If the line is blank, do not send it to the terminal buffer, unless it
    " is the second line, it may indicate the end of a function declaration.
    " If the line is non-blank, send it to the terminal buffer, if the
    " previous line was blank, send an extra line, it might be needed
    " to indicate the end of a function declaration.
    let input = getline('.')
    if input == ''
        if g:seen_blank
            call chansend(g:channel_id, "\r")
        else
            let g:seen_blank = 1
        endif
    else
        if input =~ '\m\C^\S.*' && g:seen_blank
            call chansend(g:channel_id, "\r")
            call chansend(g:channel_id, input."\r")
        else
            call chansend(g:channel_id, input."\r")
        endif
        let g:seen_blank = 0
    endif
    execute 'normal! j0'
endfunction


" The mappings for normal mode
nmap <leader>k :call KillPython()<CR>
nmap <leader>s :call StartPython()<CR>
nmap <space> :call SendLineTermBuf()<CR>

" The mappings for visual mode
vmap <space> :<c-u>call SendLinesTermBuf()<CR>
```

