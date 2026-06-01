---
title: "JetBrains Remote Development Download Network Validation"
subtitle: "Huawei vs 5090, Asia/Shanghai, 2026-04-29"
author: "Prepared for JetBrains / SRE / AWS investigation"
date: "2026-04-29"
lang: zh-CN
geometry: margin=22mm
fontsize: 10pt
mainfont: Noto Serif CJK SC
sansfont: Noto Sans CJK SC
monofont: Noto Sans Mono CJK SC
colorlinks: true
---

# 1. 摘要

本次在两台服务器上按 JetBrains 提供的命令验证同一个下载目标：

`https://download.jetbrains.com/idea/code-with-me/JetBrainsClient-253.20558.58.jbr.win.zip`

结论需要分开看：

- **Huawei**：不是下载慢，而是系统 DNS 解析失败。`curl` 两轮均以 `exit_code=6` 结束，错误为 `Could not resolve host: download.jetbrains.com`。但同机上 `dig @8.8.8.8` 和 `dig @1.1.1.1` 能解析 JetBrains/CloudFront 记录，说明问题集中在本机 systemd-resolved/uplink resolver 路径，而不是权威 DNS 或公网 DNS 完全不可用。
- **5090**：下载成功，但速度明显偏慢。两轮下载 749,537,454 bytes 的文件分别耗时 **340s** 和 **334.902149s**，折算约 **2.1 MiB/s / 17.9 Mbps**。
- **5090 的 CloudFront 行为很关键**：初始 `download.jetbrains.com` 302 响应显示 `x-geocode: HK` 且 `x-amz-cf-pop: HKG1-P1`，但重定向后的实际文件 `download-cdn.jetbrains.com` 来自 **`x-amz-cf-pop: SFO53-P5`**。也就是说入口识别为 HK，但实际大文件 CDN POP 落到了 SFO。
- 两台机器均未发现 `HTTP_PROXY` / `HTTPS_PROXY` / `ALL_PROXY` 等代理环境变量。
- 两台机器均显示 IPv6 路由不可达；5090 可以解析 AAAA，但实际使用 IPv4 连接。外部 IPv6 IP 查询失败。

# 2. 测试范围

## 2.1 执行时间

- Huawei：2026-04-29 23:34:57 - 23:35:17 CST
- 5090：2026-04-29 23:35:02 - 23:46:18 CST

## 2.2 原始命令

第一轮：

```bash
curl -vL "https://download.jetbrains.com/idea/code-with-me/JetBrainsClient-253.20558.58.jbr.win.zip" \
  -o JetBrainsClient-253.20558.58.jbr.win.zip \
  2> check-speed-idea.log
```

第二轮：

```bash
curl -vL \
  -o JetBrainsClient-253.20558.58.jbr.win.zip \
  -w "\n\
DNS Lookup:    %{time_namelookup}s\n\
TCP Connect:   %{time_connect}s\n\
TLS Handshake: %{time_appconnect}s\n\
Pre-Transfer:  %{time_pretransfer}s\n\
TTFB:          %{time_starttransfer}s\n\
Total Time:    %{time_total}s\n\
Download Size: %{size_download} bytes\n\
HTTP Code:     %{http_code}\n" \
  "https://download.jetbrains.com/idea/code-with-me/JetBrainsClient-253.20558.58.jbr.win.zip" \
  2> curl.log \
  > curl-times.txt
```

# 3. 关键结果

| 项目 | Huawei | 5090 |
|---|---:|---:|
| 第一轮 `curl` exit code | 6 | 0 |
| 第一轮耗时 | 4s | 340s |
| 第二轮 `curl` exit code | 6 | 0 |
| 第二轮 Total Time | 3.909533s | 334.902149s |
| 第二轮 HTTP Code | 000 | 200 |
| 第二轮下载大小 | 0 bytes | 749,537,454 bytes |
| 估算平均速度 | N/A, DNS failed | ~2.14 MiB/s / ~17.9 Mbps |
| 外部 IPv4 | 113.44.57.56, via manual DNS bypass | 160.20.53.106 |
| 外部 IPv6 | 无 IPv6 路由 / 查询失败 | 无 IPv6 路由 / 查询失败 |
| 代理环境变量 | 未发现 | 未发现 |
| IPv6 路由 | `Network is unreachable` | `Network is unreachable` |

# 4. 5090 的 CloudFront 观测

5090 成功下载，但实际文件由 SFO CloudFront POP 返回：

| 阶段 | Host | 结果 |
|---|---|---|
| 初始请求 | `download.jetbrains.com` | HTTP/2 302 |
| 初始 POP | `download.jetbrains.com` | `x-amz-cf-pop: HKG1-P1` |
| 初始 geocode | `download.jetbrains.com` | `x-geocode: HK` |
| 重定向地址 | `download-cdn.jetbrains.com` | JetBrainsClient zip |
| 实际文件 POP | `download-cdn.jetbrains.com` | `x-amz-cf-pop: SFO53-P5` |
| 实际文件 cache | `download-cdn.jetbrains.com` | `Hit from cloudfront` in second run |
| 实际连接 IP | `download-cdn.jetbrains.com` | `18.238.192.80` in second run |

这与 JetBrains/SRE 提到的现象一致：即使入口被识别为 HK，实际大文件流量没有落到更近的 CloudFront 边缘节点，而是走到了海外 SFO POP。

# 5. Huawei 的 DNS 观测

Huawei 的系统 resolver 失败，但直接指定公网 DNS 可以解析：

- `/etc/resolv.conf` 指向 `127.0.0.53`，systemd-resolved 的 eth0 uplink 是 `100.125.1.250`。
- `curl` 使用系统 resolver 解析 `download.jetbrains.com` 失败。
- `resolvectl query download.jetbrains.com` 在补充排查中长时间无返回，已终止该补充命令。
- `dig A/AAAA @8.8.8.8` 和 `dig A/AAAA @1.1.1.1` 对 JetBrains 域名可以返回 CloudFront 记录。
- 通过手工 `dig @8.8.8.8` 解析 IP 后，用 `curl --resolve` 查询外部 IPv4，得到 `113.44.57.56`。

因此 Huawei 当前主问题更像 **本机 DNS stub/uplink resolver 链路异常**，不能直接用于判断 JetBrains 下载 CDN 的吞吐表现，除非先修复或绕过系统 DNS。

## 5.1 Huawei 补充重试：JetBrains 中国加速域名

根据“华为云中国大陆服务器理论上应命中 JetBrains 中国大陆加速服务”的判断，2026-04-30 00:13-00:40 CST 又做了一轮更有耐心的补充测试。测试方法没有修改服务器 DNS 配置，而是：

- 对系统 resolver、Huawei 内部 DNS、AliDNS、114DNS、DNSPod、Google DNS、Cloudflare DNS 做多轮解析检查。
- 系统 resolver 路径连续 3 轮 `curl --retry 2`，每轮实际尝试 3 次，仍全部失败。
- 当入口域名 `download.jetbrains.com` 能用外部 DNS 解析后，用 `curl --resolve` 固定入口 IP，继续跟随 JetBrains 的 302 跳转。
- 这次确认 Huawei 会被 JetBrains 入口识别为 **CN**，并被重定向到中国加速域名：

```text
location: https://download-cdn.clf.jetbrains.com.cn/idea/code-with-me/JetBrainsClient-253.20558.58.jbr.win.zip...
x-geocode: CN
```

关键结果如下：

| 测试项 | 结果 |
|---|---|
| `getent ahostsv4 download.jetbrains.com` | 失败，exit code 2 |
| `resolvectl query download.jetbrains.com` | 30s 超时，exit code 124 |
| 系统 resolver `curl --retry 2` | 3 轮均失败，错误仍为 `Could not resolve host: download.jetbrains.com` |
| Huawei DNS `100.125.1.250` | `dig` 对 JetBrains 域名超时，no servers could be reached |
| AliDNS `223.5.5.5` 解析 CLF | `download-cdn.clf.jetbrains.com.cn -> 119.0.68.16` |
| 114DNS `114.114.114.114` 解析 CLF | `download-cdn.clf.jetbrains.com.cn -> 36.153.95.129` |
| DNSPod `119.29.29.29` 解析 CLF | `download-cdn.clf.jetbrains.com.cn -> 36.153.95.129` |

完整下载测试中，AliDNS 固定解析路径可以成功下载完整文件：

```text
Remote IP:     119.0.68.16
HTTP Code:     200
Download Size: 749537454 bytes
Total Time:    567.845507s
Speed:         1319968 bytes/s
```

折算速度约为 **1.26 MiB/s / 10.6 Mbps**。这说明 Huawei 服务器确实能够命中 JetBrains 的中国加速域名，并且文件服务端实际为：

```text
server: cloudflare
cf-ray: ...-KWE
```

但这条路径在本次实测中并没有比 5090 更快。作为对照，114DNS 解析到 `36.153.95.129` 后也进入了 HTTP/2 200 下载，但前 50 秒稳定在约 **1.2 MiB/s**，因此中止了后续长时间重复下载，避免继续消耗无意义的时间。

补充结论是：**“JetBrains 中国大陆加速路径存在，并且 Huawei 会被重定向到该路径”这一点已经验证；但当前 Huawei 的系统 DNS 仍阻塞正常下载，而绕过 DNS 后的 CLF 下载速度约 1.2-1.3 MiB/s，并未表现出预期的高速。**

# 6. DNS 结果摘要

## 6.1 Huawei

- `download.jetbrains.com @8.8.8.8 A` -> `3.165.11.66`, `3.165.11.38`, `3.165.11.5`, `3.165.11.103`
- `download.jetbrains.com @1.1.1.1 A` -> `216.137.39.31`, `216.137.39.32`, `216.137.39.116`, `216.137.39.26`
- `download-cdn.jetbrains.com @8.8.8.8 A` -> `3.173.254.86`, `3.173.254.99`, `3.173.254.26`, `3.173.254.118`
- `download-cdn.jetbrains.com @1.1.1.1 A` -> `18.154.206.79`, `18.154.206.91`, `18.154.206.111`, `18.154.206.30`; observed one timeout before successful answer.
- AAAA 查询也返回 CloudFront IPv6 地址，但本机 IPv6 route 不可达。

## 6.2 5090

- `download.jetbrains.com @8.8.8.8/@1.1.1.1 A` -> `54.230.70.27`, `54.230.70.78`, `54.230.70.88`, `54.230.70.109`
- `download-cdn.jetbrains.com @8.8.8.8/@1.1.1.1 A` -> `13.35.190.21`, `13.35.190.61`, `13.35.190.64`, `13.35.190.99`
- `curl` 运行时系统 resolver 返回的 `download-cdn.jetbrains.com` IPv4 是 `18.238.192.80`, `18.238.192.105`, `18.238.192.40`, `18.238.192.117`，实际连接 `18.238.192.80`。
- AAAA 查询返回 CloudFront IPv6 地址，但本机 IPv6 route 不可达。

# 7. 原始文件清单

所有原始文件已保存在本机目录：

`/home/ziyu/PROJECT/jetbrains-network-validation-20260429/raw/`

每台机器分别包含：

- `check-speed-idea.log`：第一轮 `curl -vL` 的完整 stderr。
- `check-speed-idea.summary.txt`：第一轮命令、exit code、耗时、文件大小。
- `curl.log`：第二轮 `curl -vL` 的完整 stderr。
- `curl-times.txt`：第二轮 `curl -w` timing 输出。
- `curl-times.summary.txt`：第二轮命令、exit code、耗时、文件大小。
- `dns-results.txt`：JetBrains 要求的 8 条 `dig` 命令完整输出。
- `external-ip.txt`：外部 IPv4/IPv6 查询原始输出。
- `system-info.txt`：系统、curl/dig 版本、代理环境、路由、resolver 配置。
- `resolver-extra.txt`：补充 resolver 状态。

# 8. 终端输出附录

以下附录只放关键终端输出，完整 verbose/progress 日志见第 7 节原始文件。

## 8.1 Huawei: curl summary

```text
curl -vL "https://download.jetbrains.com/idea/code-with-me/JetBrainsClient-253.20558.58.jbr.win.zip" \
  -o JetBrainsClient-253.20558.58.jbr.win.zip \
  2> check-speed-idea.log

exit_code=6
started_epoch=1777476909
ended_epoch=1777476913
elapsed_seconds=4

[file]
```

```text

DNS Lookup:    0.000000s
TCP Connect:   0.000000s
TLS Handshake: 0.000000s
Pre-Transfer:  0.000000s
TTFB:          0.000000s
Total Time:    3.909533s
Download Size: 0 bytes
HTTP Code:     000
```

## 8.2 Huawei: curl error

```text
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0  0     0    0     0    0     0      0      0 --:--:--  0:00:01 --:--:--     0  0     0    0     0    0     0      0      0 --:--:--  0:00:02 --:--:--     0  0     0    0     0    0     0      0      0 --:--:--  0:00:03 --:--:--     0* Could not resolve host: download.jetbrains.com
* Closing connection 0
curl: (6) Could not resolve host: download.jetbrains.com
```

## 8.3 Huawei: external IP and resolver

```text
$ printf '[IPv4]\n'; curl -4 -sS --max-time 30 https://api.ipify.org; printf '\n\n[IPv6]\n'; curl -6 -sS --max-time 30 https://api64.ipify.org; printf '\n'

[IPv4]
curl: (6) Could not resolve host: api.ipify.org


[IPv6]
curl: (6) Could not resolve host: api64.ipify.org


[exit_code]=0

$ curl --resolve checkip.amazonaws.com:443:52.76.181.204 https://checkip.amazonaws.com
113.44.57.56

$ curl --resolve ipinfo.io:443:34.117.59.81 https://ipinfo.io/ip
113.44.57.56
```

```text
$ resolvectl status || systemd-resolve --status
Global
       LLMNR setting: no                  
MulticastDNS setting: no                  
  DNSOverTLS setting: no                  
      DNSSEC setting: no                  
    DNSSEC supported: no                  
          DNS Domain: openstacklocal      
                      tailcdd329.ts.net   
          DNSSEC NTA: 10.in-addr.arpa     
                      16.172.in-addr.arpa 
                      168.192.in-addr.arpa
                      17.172.in-addr.arpa 
                      18.172.in-addr.arpa 
                      19.172.in-addr.arpa 
                      20.172.in-addr.arpa 
                      21.172.in-addr.arpa 
                      22.172.in-addr.arpa 
                      23.172.in-addr.arpa 
                      24.172.in-addr.arpa 
                      25.172.in-addr.arpa 
                      26.172.in-addr.arpa 
                      27.172.in-addr.arpa 
                      28.172.in-addr.arpa 
                      29.172.in-addr.arpa 
                      30.172.in-addr.arpa 
                      31.172.in-addr.arpa 
                      corp                
                      d.f.ip6.arpa        
                      home                
                      internal            
                      intranet            
                      lan                 
                      local               
                      private             
                      test                

Link 10 (tailscale0)
      Current Scopes: DNS                              
DefaultRoute setting: no                               
       LLMNR setting: no                               
MulticastDNS setting: no                               
  DNSOverTLS setting: no                               
      DNSSEC setting: no                               
    DNSSEC supported: no                               
  Current DNS Server: 100.100.100.100                  
         DNS Servers: 100.100.100.100                  
          DNS Domain: tailcdd329.ts.net                
                      ~0.e.1.a.c.5.1.1.a.7.d.f.ip6.arpa
                      ~100.100.in-addr.arpa            
                      ~101.100.in-addr.arpa            
                      ~102.100.in-addr.arpa            
                      ~103.100.in-addr.arpa            
                      ~104.100.in-addr.arpa            
                      ~105.100.in-addr.arpa            
                      ~106.100.in-addr.arpa            
                      ~107.100.in-addr.arpa            
                      ~108.100.in-addr.arpa            
                      ~109.100.in-addr.arpa            
                      ~110.100.in-addr.arpa            
                      ~111.100.in-addr.arpa            
                      ~112.100.in-addr.arpa            
                      ~113.100.in-addr.arpa            
                      ~114.100.in-addr.arpa            
                      ~115.100.in-addr.arpa            
                      ~116.100.in-addr.arpa            
                      ~117.100.in-addr.arpa            
                      ~118.100.in-addr.arpa            
                      ~119.100.in-addr.arpa            
                      ~120.100.in-addr.arpa            
                      ~121.100.in-addr.arpa            
                      ~122.100.in-addr.arpa            
                      ~123.100.in-addr.arpa            
                      ~124.100.in-addr.arpa            
                      ~125.100.in-addr.arpa            
                      ~126.100.in-addr.arpa            
                      ~127.100.in-addr.arpa            
                      ~64.100.in-addr.arpa             
                      ~65.100.in-addr.arpa             
                      ~66.100.in-addr.arpa             
                      ~67.100.in-addr.arpa             
                      ~68.100.in-addr.arpa             
                      ~69.100.in-addr.arpa             
                      ~70.100.in-addr.arpa             
                      ~71.100.in-addr.arpa             
                      ~72.100.in-addr.arpa             
                      ~73.100.in-addr.arpa             
                      ~74.100.in-addr.arpa             
                      ~75.100.in-addr.arpa             
                      ~76.100.in-addr.arpa             
                      ~77.100.in-addr.arpa             
                      ~78.100.in-addr.arpa             
                      ~79.100.in-addr.arpa             
                      ~80.100.in-addr.arpa             
                      ~81.100.in-addr.arpa             
                      ~82.100.in-addr.arpa             
                      ~83.100.in-addr.arpa             
                      ~84.100.in-addr.arpa             
                      ~85.100.in-addr.arpa             
                      ~86.100.in-addr.arpa             
                      ~87.100.in-addr.arpa             
                      ~88.100.in-addr.arpa             
                      ~89.100.in-addr.arpa             
                      ~90.100.in-addr.arpa             
                      ~91.100.in-addr.arpa             
                      ~92.100.in-addr.arpa             
                      ~93.100.in-addr.arpa             
                      ~94.100.in-addr.arpa             
                      ~95.100.in-addr.arpa             
                      ~96.100.in-addr.arpa             
                      ~97.100.in-addr.arpa             
                      ~98.100.in-addr.arpa             
                      ~99.100.in-addr.arpa             
                      ~ts.net                          

Link 3 (docker0)
      Current Scopes: none
DefaultRoute setting: no  
       LLMNR setting: yes 
MulticastDNS setting: no  
  DNSOverTLS setting: no  
      DNSSEC setting: no  
    DNSSEC supported: no  

Link 2 (eth0)
      Current Scopes: DNS           
DefaultRoute setting: yes           
       LLMNR setting: yes           
MulticastDNS setting: no            
  DNSOverTLS setting: no            
      DNSSEC setting: no            
    DNSSEC supported: no            
  Current DNS Server: 100.125.1.250 
         DNS Servers: 100.125.1.250 
          DNS Domain: ~.            
                      openstacklocal

$ resolvectl query download.jetbrains.com
```

## 8.4 Huawei: system snapshot

```text
Server label: Huawei
Hostname: hcss-ecs-aab9
Started at: 2026-04-29T23:34:57+08:00

[uname]
Linux hcss-ecs-aab9 5.4.0-190-generic #210-Ubuntu SMP Fri Jul 5 17:03:38 UTC 2024 x86_64 x86_64 x86_64 GNU/Linux

[curl version]
curl 7.68.0 (x86_64-pc-linux-gnu) libcurl/7.68.0 OpenSSL/1.1.1f zlib/1.2.11 brotli/1.0.7 libidn2/2.2.0 libpsl/0.21.0 (+libidn2/2.2.0) libssh/0.9.3/openssl/zlib nghttp2/1.40.0 librtmp/2.3
Release-Date: 2020-01-08
Protocols: dict file ftp ftps gopher http https imap imaps ldap ldaps pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp 
Features: AsynchDNS brotli GSS-API HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM NTLM_WB PSL SPNEGO SSL TLS-SRP UnixSockets

[dig version]
DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu

[proxy environment]
No proxy environment variables found.

[ip route IPv4]
8.8.8.8 via 192.168.0.1 dev eth0 src 192.168.3.137 uid 0 
    cache 

[ip route IPv6]
RTNETLINK answers: Network is unreachable

[resolver]
# Dynamic resolv.conf(5) file for glibc resolver(3) generated by resolvconf(8)
#     DO NOT EDIT THIS FILE BY HAND -- YOUR CHANGES WILL BE OVERWRITTEN
# 127.0.0.53 is the systemd-resolved stub resolver.
# run "systemd-resolve --status" to see details about the actual nameservers.

nameserver 127.0.0.53
search openstacklocal tailcdd329.ts.net
options timeout:1 single-request-reopen
```

## 8.5 5090: curl timing

```text
curl -vL "https://download.jetbrains.com/idea/code-with-me/JetBrainsClient-253.20558.58.jbr.win.zip" \
  -o JetBrainsClient-253.20558.58.jbr.win.zip \
  2> check-speed-idea.log

exit_code=0
started_epoch=1777476903
ended_epoch=1777477243
elapsed_seconds=340

[file]
-rw-rw-r-- 1 ubuntu ubuntu 715M Apr 29 23:40 JetBrainsClient-253.20558.58.jbr.win.zip


DNS Lookup:    0.258650s
TCP Connect:   0.498220s
TLS Handshake: 0.748999s
Pre-Transfer:  0.749251s
TTFB:          1.213278s
Total Time:    334.902149s
Download Size: 749537454 bytes
HTTP Code:     200
```

## 8.6 5090: CloudFront headers from `curl.log`

```text
< HTTP/2 302 
< content-type: text/html
< content-length: 138
< location: https://download-cdn.jetbrains.com/idea/code-with-me/JetBrainsClient-253.20558.58.jbr.win.zip
< date: Wed, 29 Apr 2026 15:40:43 GMT
< x-geocode: HK
< x-cache: Miss from cloudfront
< via: 1.1 63947a1a73ede74a39fa169dcf13227a.cloudfront.net (CloudFront)
< x-amz-cf-pop: HKG1-P1
< content-type: binary/octet-stream
< content-length: 749537454
< date: Wed, 29 Apr 2026 15:35:06 GMT
< x-cache: Hit from cloudfront
< via: 1.1 3c65c8de2d2443b1201cd33d859d8db0.cloudfront.net (CloudFront)
< x-amz-cf-pop: SFO53-P5
```

## 8.7 5090: connection target from `curl.log`

```text
* IPv6: 2600:9000:2014:da00:12:7c44:15c0:93a1, 2600:9000:2014:c400:12:7c44:15c0:93a1, 2600:9000:2014:fa00:12:7c44:15c0:93a1, 2600:9000:2014:3400:12:7c44:15c0:93a1, 2600:9000:2014:2e00:12:7c44:15c0:93a1, 2600:9000:2014:2000:12:7c44:15c0:93a1, 2600:9000:2014:ca00:12:7c44:15c0:93a1, 2600:9000:2014:0:12:7c44:15c0:93a1
* IPv4: 54.230.70.78, 54.230.70.88, 54.230.70.27, 54.230.70.109
* Connected to download.jetbrains.com (54.230.70.78) port 443
* Host download-cdn.jetbrains.com:443 was resolved.
* IPv6: 2600:9000:25f2:b800:6:6899:5680:93a1, 2600:9000:25f2:f000:6:6899:5680:93a1, 2600:9000:25f2:e800:6:6899:5680:93a1, 2600:9000:25f2:4a00:6:6899:5680:93a1, 2600:9000:25f2:4c00:6:6899:5680:93a1, 2600:9000:25f2:2600:6:6899:5680:93a1, 2600:9000:25f2:1e00:6:6899:5680:93a1, 2600:9000:25f2:1c00:6:6899:5680:93a1
* IPv4: 18.238.192.80, 18.238.192.105, 18.238.192.40, 18.238.192.117
* Connected to download-cdn.jetbrains.com (18.238.192.80) port 443
```

## 8.8 5090: external IP and resolver

```text
$ printf '[IPv4]\n'; curl -4 -sS --max-time 30 https://api.ipify.org; printf '\n\n[IPv6]\n'; curl -6 -sS --max-time 30 https://api64.ipify.org; printf '\n'

[IPv4]
160.20.53.106

[IPv6]
curl: (7) Failed to connect to api64.ipify.org port 443 after 11 ms: Couldn't connect to server


[exit_code]=0

$ resolvectl status
Global
         Protocols: -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
  resolv.conf mode: stub

Link 2 (enp130s0)
    Current Scopes: DNS
         Protocols: +DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 10.6.0.2
       DNS Servers: 10.6.0.2 10.6.0.3
        DNS Domain: xjtlu.edu.cn

Link 3 (wlp129s0)
    Current Scopes: none
         Protocols: -DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported

Link 4 (tailscale0)
    Current Scopes: DNS
         Protocols: -DefaultRoute -LLMNR -mDNS -DNSOverTLS DNSSEC=no/unsupported
Current DNS Server: 100.100.100.100
       DNS Servers: 100.100.100.100 fd7a:115c:a1e0::53
        DNS Domain: tailcdd329.ts.net ~0.e.1.a.c.5.1.1.a.7.d.f.ip6.arpa
                    ~100.100.in-addr.arpa ~101.100.in-addr.arpa
                    ~102.100.in-addr.arpa ~103.100.in-addr.arpa
                    ~104.100.in-addr.arpa ~105.100.in-addr.arpa
                    ~106.100.in-addr.arpa ~107.100.in-addr.arpa
                    ~108.100.in-addr.arpa ~109.100.in-addr.arpa
                    ~110.100.in-addr.arpa ~111.100.in-addr.arpa
                    ~112.100.in-addr.arpa ~113.100.in-addr.arpa
                    ~114.100.in-addr.arpa ~115.100.in-addr.arpa
                    ~116.100.in-addr.arpa ~117.100.in-addr.arpa
                    ~118.100.in-addr.arpa ~119.100.in-addr.arpa
                    ~120.100.in-addr.arpa ~121.100.in-addr.arpa
                    ~122.100.in-addr.arpa ~123.100.in-addr.arpa
                    ~124.100.in-addr.arpa ~125.100.in-addr.arpa
                    ~126.100.in-addr.arpa ~127.100.in-addr.arpa
                    ~64.100.in-addr.arpa ~65.100.in-addr.arpa
                    ~66.100.in-addr.arpa ~67.100.in-addr.arpa
                    ~68.100.in-addr.arpa ~69.100.in-addr.arpa
                    ~70.100.in-addr.arpa ~71.100.in-addr.arpa
                    ~72.100.in-addr.arpa ~73.100.in-addr.arpa
                    ~74.100.in-addr.arpa ~75.100.in-addr.arpa
                    ~76.100.in-addr.arpa ~77.100.in-addr.arpa
                    ~78.100.in-addr.arpa ~79.100.in-addr.arpa
                    ~80.100.in-addr.arpa ~81.100.in-addr.arpa
                    ~82.100.in-addr.arpa ~83.100.in-addr.arpa
                    ~84.100.in-addr.arpa ~85.100.in-addr.arpa
                    ~86.100.in-addr.arpa ~87.100.in-addr.arpa
                    ~88.100.in-addr.arpa ~89.100.in-addr.arpa
                    ~90.100.in-addr.arpa ~91.100.in-addr.arpa
                    ~92.100.in-addr.arpa ~93.100.in-addr.arpa
                    ~94.100.in-addr.arpa ~95.100.in-addr.arpa
                    ~96.100.in-addr.arpa ~97.100.in-addr.arpa
                    ~98.100.in-addr.arpa ~99.100.in-addr.arpa ~ts.net

$ resolvectl query download.jetbrains.com
download.jetbrains.com: 2600:9000:2014:4000:12:7c44:15c0:93a1 -- link: enp130s0
                        2600:9000:2014:5000:12:7c44:15c0:93a1 -- link: enp130s0
                        2600:9000:2014:9000:12:7c44:15c0:93a1 -- link: enp130s0
                        2600:9000:2014:3800:12:7c44:15c0:93a1 -- link: enp130s0
                        2600:9000:2014:ec00:12:7c44:15c0:93a1 -- link: enp130s0
                        2600:9000:2014:2c00:12:7c44:15c0:93a1 -- link: enp130s0
                        2600:9000:2014:5200:12:7c44:15c0:93a1 -- link: enp130s0
                        2600:9000:2014:3000:12:7c44:15c0:93a1 -- link: enp130s0
                        54.230.70.88                        -- link: enp130s0
                        54.230.70.27                        -- link: enp130s0
                        54.230.70.109                       -- link: enp130s0
                        54.230.70.78                        -- link: enp130s0
                        (d1do0znm134sif.cloudfront.net)

-- Information acquired via protocol DNS in 309.8ms.
-- Data is authenticated: no; Data was acquired via local or encrypted transport: no
-- Data from: network
```

## 8.9 5090: system snapshot

```text
Server label: 5090
Hostname: ubuntu-Z890-EAGLE-WIFI7
Started at: 2026-04-29T23:35:02+08:00

[uname]
Linux ubuntu-Z890-EAGLE-WIFI7 6.17.0-22-generic #22~24.04.1-Ubuntu SMP PREEMPT_DYNAMIC Thu Mar 26 15:25:54 UTC 2 x86_64 x86_64 x86_64 GNU/Linux

[curl version]
curl 8.5.0 (x86_64-pc-linux-gnu) libcurl/8.5.0 OpenSSL/3.0.13 zlib/1.3 brotli/1.1.0 zstd/1.5.5 libidn2/2.3.7 libpsl/0.21.2 (+libidn2/2.3.7) libssh/0.10.6/openssl/zlib nghttp2/1.59.0 librtmp/2.3 OpenLDAP/2.6.10
Release-Date: 2023-12-06, security patched: 8.5.0-2ubuntu10.8
Protocols: dict file ftp ftps gopher gophers http https imap imaps ldap ldaps mqtt pop3 pop3s rtmp rtsp scp sftp smb smbs smtp smtps telnet tftp
Features: alt-svc AsynchDNS brotli GSS-API HSTS HTTP2 HTTPS-proxy IDN IPv6 Kerberos Largefile libz NTLM PSL SPNEGO SSL threadsafe TLS-SRP UnixSockets zstd

[dig version]
DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu

[proxy environment]
No proxy environment variables found.

[ip route IPv4]
8.8.8.8 via 10.12.48.1 dev enp130s0 src 10.12.48.170 uid 1000 
    cache 

[ip route IPv6]
RTNETLINK answers: Network is unreachable

[resolver]
# This is /run/systemd/resolve/stub-resolv.conf managed by man:systemd-resolved(8).
# Do not edit.
#
# This file might be symlinked as /etc/resolv.conf. If you're looking at
# /etc/resolv.conf and seeing this text, you have followed the symlink.
#
# This is a dynamic resolv.conf file for connecting local clients to the
# internal DNS stub resolver of systemd-resolved. This file lists all
# configured search domains.
#
# Run "resolvectl status" to see details about the uplink DNS servers
# currently in use.
#
# Third party programs should typically not access this file directly, but only
# through the symlink at /etc/resolv.conf. To manage man:resolv.conf(5) in a
# different way, replace this symlink by a static file or a different symlink.
#
# See man:systemd-resolved.service(8) for details about the supported modes of
# operation for /etc/resolv.conf.

nameserver 127.0.0.53
options edns0 trust-ad
search tailcdd329.ts.net xjtlu.edu.cn
```

## 8.10 Full DNS command output

### Huawei

```text
$ dig A @8.8.8.8 download.jetbrains.com; dig A @1.1.1.1 download.jetbrains.com; dig A @8.8.8.8 download-cdn.jetbrains.com; dig A @1.1.1.1 download-cdn.jetbrains.com; dig AAAA @8.8.8.8 download.jetbrains.com; dig AAAA @1.1.1.1 download.jetbrains.com; dig AAAA @8.8.8.8 download-cdn.jetbrains.com; dig AAAA @1.1.1.1 download-cdn.jetbrains.com


; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> A @8.8.8.8 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 26674
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download.jetbrains.com.		IN	A

;; ANSWER SECTION:
download.jetbrains.com.	120	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 60 IN	A	3.165.11.66
d1do0znm134sif.cloudfront.net. 60 IN	A	3.165.11.38
d1do0znm134sif.cloudfront.net. 60 IN	A	3.165.11.5
d1do0znm134sif.cloudfront.net. 60 IN	A	3.165.11.103

;; Query time: 227 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:06 CST 2026
;; MSG SIZE  rcvd: 158


; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> A @1.1.1.1 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 52553
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download.jetbrains.com.		IN	A

;; ANSWER SECTION:
download.jetbrains.com.	92	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 32 IN	A	216.137.39.31
d1do0znm134sif.cloudfront.net. 32 IN	A	216.137.39.32
d1do0znm134sif.cloudfront.net. 32 IN	A	216.137.39.116
d1do0znm134sif.cloudfront.net. 32 IN	A	216.137.39.26

;; Query time: 179 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:06 CST 2026
;; MSG SIZE  rcvd: 158


; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> A @8.8.8.8 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 59218
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	A

;; ANSWER SECTION:
download-cdn.jetbrains.com. 60	IN	A	3.173.254.86
download-cdn.jetbrains.com. 60	IN	A	3.173.254.99
download-cdn.jetbrains.com. 60	IN	A	3.173.254.26
download-cdn.jetbrains.com. 60	IN	A	3.173.254.118

;; Query time: 271 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:06 CST 2026
;; MSG SIZE  rcvd: 119

;; communications error to 1.1.1.1#53: timed out

; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> A @1.1.1.1 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 20669
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	A

;; ANSWER SECTION:
download-cdn.jetbrains.com. 47	IN	A	18.154.206.79
download-cdn.jetbrains.com. 47	IN	A	18.154.206.91
download-cdn.jetbrains.com. 47	IN	A	18.154.206.111
download-cdn.jetbrains.com. 47	IN	A	18.154.206.30

;; Query time: 183 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:08 CST 2026
;; MSG SIZE  rcvd: 119


; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> AAAA @8.8.8.8 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 9151
;; flags: qr rd ra; QUERY: 1, ANSWER: 9, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download.jetbrains.com.		IN	AAAA

;; ANSWER SECTION:
download.jetbrains.com.	120	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:6200:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:6800:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:9e00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:b000:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:a400:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:7200:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:6e00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:26ef:1e00:12:7c44:15c0:93a1

;; Query time: 255 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:08 CST 2026
;; MSG SIZE  rcvd: 318


; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> AAAA @1.1.1.1 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 203
;; flags: qr rd ra; QUERY: 1, ANSWER: 9, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download.jetbrains.com.		IN	AAAA

;; ANSWER SECTION:
download.jetbrains.com.	51	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:6e00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:e00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:1400:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:8800:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:800:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:2000:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:4200:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2365:8000:12:7c44:15c0:93a1

;; Query time: 183 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:08 CST 2026
;; MSG SIZE  rcvd: 318


; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> AAAA @8.8.8.8 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 33269
;; flags: qr rd ra; QUERY: 1, ANSWER: 8, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	AAAA

;; ANSWER SECTION:
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:fe00:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:aa00:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:b400:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:b200:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:400:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:3600:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:1a00:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2957:5a00:6:6899:5680:93a1

;; Query time: 327 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:08 CST 2026
;; MSG SIZE  rcvd: 279


; <<>> DiG 9.18.28-0ubuntu0.20.04.1-Ubuntu <<>> AAAA @1.1.1.1 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 30460
;; flags: qr rd ra; QUERY: 1, ANSWER: 8, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	AAAA

;; ANSWER SECTION:
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:7600:6:6899:5680:93a1
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:e400:6:6899:5680:93a1
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:0:6:6899:5680:93a1
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:9600:6:6899:5680:93a1
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:a400:6:6899:5680:93a1
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:f200:6:6899:5680:93a1
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:da00:6:6899:5680:93a1
download-cdn.jetbrains.com. 12	IN	AAAA	2600:9000:265c:4a00:6:6899:5680:93a1

;; Query time: 179 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:09 CST 2026
;; MSG SIZE  rcvd: 279


[exit_code]=0
```

### 5090

```text
$ dig A @8.8.8.8 download.jetbrains.com; dig A @1.1.1.1 download.jetbrains.com; dig A @8.8.8.8 download-cdn.jetbrains.com; dig A @1.1.1.1 download-cdn.jetbrains.com; dig AAAA @8.8.8.8 download.jetbrains.com; dig AAAA @1.1.1.1 download.jetbrains.com; dig AAAA @8.8.8.8 download-cdn.jetbrains.com; dig AAAA @1.1.1.1 download-cdn.jetbrains.com


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> A @8.8.8.8 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 8618
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download.jetbrains.com.		IN	A

;; ANSWER SECTION:
download.jetbrains.com.	120	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 60 IN	A	54.230.70.109
d1do0znm134sif.cloudfront.net. 60 IN	A	54.230.70.88
d1do0znm134sif.cloudfront.net. 60 IN	A	54.230.70.27
d1do0znm134sif.cloudfront.net. 60 IN	A	54.230.70.78

;; Query time: 52 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:02 CST 2026
;; MSG SIZE  rcvd: 158


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> A @1.1.1.1 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 11277
;; flags: qr rd ra; QUERY: 1, ANSWER: 5, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download.jetbrains.com.		IN	A

;; ANSWER SECTION:
download.jetbrains.com.	114	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 54 IN	A	54.230.70.109
d1do0znm134sif.cloudfront.net. 54 IN	A	54.230.70.27
d1do0znm134sif.cloudfront.net. 54 IN	A	54.230.70.78
d1do0znm134sif.cloudfront.net. 54 IN	A	54.230.70.88

;; Query time: 46 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:02 CST 2026
;; MSG SIZE  rcvd: 158


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> A @8.8.8.8 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12143
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	A

;; ANSWER SECTION:
download-cdn.jetbrains.com. 60	IN	A	13.35.190.61
download-cdn.jetbrains.com. 60	IN	A	13.35.190.21
download-cdn.jetbrains.com. 60	IN	A	13.35.190.64
download-cdn.jetbrains.com. 60	IN	A	13.35.190.99

;; Query time: 48 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:02 CST 2026
;; MSG SIZE  rcvd: 119


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> A @1.1.1.1 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 65065
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	A

;; ANSWER SECTION:
download-cdn.jetbrains.com. 26	IN	A	13.35.190.99
download-cdn.jetbrains.com. 26	IN	A	13.35.190.61
download-cdn.jetbrains.com. 26	IN	A	13.35.190.64
download-cdn.jetbrains.com. 26	IN	A	13.35.190.21

;; Query time: 63 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:02 CST 2026
;; MSG SIZE  rcvd: 119


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> AAAA @8.8.8.8 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 61344
;; flags: qr rd ra; QUERY: 1, ANSWER: 9, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download.jetbrains.com.		IN	AAAA

;; ANSWER SECTION:
download.jetbrains.com.	120	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:2600:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:4600:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:7800:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:2200:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:5400:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:f400:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:c00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 60 IN	AAAA	2600:9000:2014:b000:12:7c44:15c0:93a1

;; Query time: 82 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:02 CST 2026
;; MSG SIZE  rcvd: 318


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> AAAA @1.1.1.1 download.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 25289
;; flags: qr rd ra; QUERY: 1, ANSWER: 9, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download.jetbrains.com.		IN	AAAA

;; ANSWER SECTION:
download.jetbrains.com.	114	IN	CNAME	d1do0znm134sif.cloudfront.net.
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:8e00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:9c00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:9400:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:4200:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:1600:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:7200:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:4a00:12:7c44:15c0:93a1
d1do0znm134sif.cloudfront.net. 54 IN	AAAA	2600:9000:2014:2200:12:7c44:15c0:93a1

;; Query time: 43 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:02 CST 2026
;; MSG SIZE  rcvd: 318


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> AAAA @8.8.8.8 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 19414
;; flags: qr rd ra; QUERY: 1, ANSWER: 8, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 512
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	AAAA

;; ANSWER SECTION:
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:3800:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:3e00:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:8600:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:c00:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:d600:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:7400:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:4400:6:6899:5680:93a1
download-cdn.jetbrains.com. 60	IN	AAAA	2600:9000:2079:1600:6:6899:5680:93a1

;; Query time: 60 msec
;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)
;; WHEN: Wed Apr 29 23:35:03 CST 2026
;; MSG SIZE  rcvd: 279


; <<>> DiG 9.18.39-0ubuntu0.24.04.3-Ubuntu <<>> AAAA @1.1.1.1 download-cdn.jetbrains.com
; (1 server found)
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 24179
;; flags: qr rd ra; QUERY: 1, ANSWER: 8, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;download-cdn.jetbrains.com.	IN	AAAA

;; ANSWER SECTION:
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:5c00:6:6899:5680:93a1
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:4000:6:6899:5680:93a1
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:5400:6:6899:5680:93a1
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:400:6:6899:5680:93a1
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:4400:6:6899:5680:93a1
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:ec00:6:6899:5680:93a1
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:da00:6:6899:5680:93a1
download-cdn.jetbrains.com. 56	IN	AAAA	2600:9000:2079:c00:6:6899:5680:93a1

;; Query time: 43 msec
;; SERVER: 1.1.1.1#53(1.1.1.1) (UDP)
;; WHEN: Wed Apr 29 23:35:03 CST 2026
;; MSG SIZE  rcvd: 279


[exit_code]=0
```
