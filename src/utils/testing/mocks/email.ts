export const PLAINTEXT = `From: Richard Olsson <richard@zetkin.org>
Content-Type: text/plain
Subject: A test e-mail for rendering
Date: Sat, 14 May 2022 15:42:48 +0200
To: Richard Olsson <info@zetkin.org>

This is a plain text e-mail.

It has two lines.
`;

export const PLAINTEXT_MULTI_CC = `From: Richard Olsson <richard@zetkin.org>
Content-Type: text/plain
Subject: A test e-mail for rendering
Date: Sat, 14 May 2022 15:42:48 +0200
To: Richard Olsson <info@zetkin.org>
CC: Clara Zetkin <clara@zetkin.org>,
 clara@zetk.in,
 Clara <clara.zetkin@zetkin.org>

This is a plain text e-mail.
`;

export const MULTIPART = `Return-Path: <richard@zetkin.org>
Delivered-To: info@zetkin.org
From: Richard Olsson <richard@zetkin.org>
Content-Type: multipart/alternative;
	boundary="Apple-Mail=_B2FFAF6E-F5DA-49E5-9BB9-1E6807C89884"
Mime-Version: 1.0 (Mac OS X Mail 13.4 \\(3608.120.23.2.4\\))
Subject: A test e-mail for rendering
Date: Sat, 14 May 2022 15:42:48 +0200
To: Richard Olsson <info@zetkin.org>
X-Mailer: Apple Mail (2.3608.120.23.2.4)


--Apple-Mail=_B2FFAF6E-F5DA-49E5-9BB9-1E6807C89884
Content-Transfer-Encoding: 7bit
Content-Type: text/plain;
	charset=us-ascii

This is a test e-mail.

With a little bit of formatting.
Including a list
And also formatting in the signature


Richard Olsson, tech lead

Zetkin Foundation
www.zetkin.org/en
info@zetkin.org






--Apple-Mail=_B2FFAF6E-F5DA-49E5-9BB9-1E6807C89884
Content-Transfer-Encoding: 7bit
Content-Type: text/html;
	charset=us-ascii

<html><head><meta http-equiv="Content-Type" content="text/html; charset=us-ascii"></head><body style="word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;" class="">This is a test e-mail.<div class=""><br class=""></div><div class=""><ul class="MailOutline"><li class="">With a <i class="">little bit</i> of formatting.</li><li class="">Including a list</li><li class="">And also formatting in the signature</li></ul></div><br class=""><div class="">
<div><br class="">Richard Olsson, tech lead<br class=""><br class=""><b class="">Zetkin Foundation<br class=""></b><a href="http://www.zetkin.org/en" class="">www.zetkin.org/en</a><br class="">info@zetkin.org<br class=""><br class=""><br class=""><br class=""><br class=""></div>

</div>
<br class=""></body></html>
--Apple-Mail=_B2FFAF6E-F5DA-49E5-9BB9-1E6807C89884--
`;

export const MULTIPART_WITH_REPLY = `Return-Path: <info@zetkin.org>
Delivered-To: richard@zetkin.org
From: Richard Olsson <info@zetkin.org>
Content-Type: multipart/alternative;
	boundary="Apple-Mail=_19D75894-132F-4CB0-B342-B0A60D9F68B7"
Mime-Version: 1.0 (Mac OS X Mail 13.4 \\(3608.120.23.2.4\\))
Subject: Re: A test e-mail for rendering
Date: Sat, 14 May 2022 16:14:49 +0200
To: Richard Olsson <richard@zetkin.org>
X-Mailer: Apple Mail (2.3608.120.23.2.4)


--Apple-Mail=_19D75894-132F-4CB0-B342-B0A60D9F68B7
Content-Transfer-Encoding: 7bit
Content-Type: text/plain;
	charset=us-ascii

A reply


> On 14 May 2022, at 15:42, Richard Olsson <richard@zetkin.org> wrote:
> 
> This is a test e-mail.
> 
> With a little bit of formatting.
> Including a list
> And also formatting in the signature
> 
> 
> Richard Olsson, tech lead
> 
> Zetkin Foundation
> www.zetkin.org/en <http://www.zetkin.org/en>
> info@zetkin.org
> 
> 
> 
> 
> 


--Apple-Mail=_19D75894-132F-4CB0-B342-B0A60D9F68B7
Content-Transfer-Encoding: 7bit
Content-Type: text/html;
	charset=us-ascii

<html><head><meta http-equiv="Content-Type" content="text/html; charset=us-ascii"></head><body style="word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;" class="">A reply<br class=""><div class=""><div><br class=""></div>

</div>
<div style=""><br class=""><blockquote type="cite" class=""><div class="">On 14 May 2022, at 15:42, Richard Olsson &lt;<a href="mailto:richard@zetkin.org" class="">richard@zetkin.org</a>&gt; wrote:</div><br class="Apple-interchange-newline"><div class=""><meta http-equiv="Content-Type" content="text/html; charset=us-ascii" class=""><div style="word-wrap: break-word; -webkit-nbsp-mode: space; line-break: after-white-space;" class="">This is a test e-mail.<div class=""><br class=""></div><div class=""><ul class="MailOutline"><li class="">With a <i class="">little bit</i> of formatting.</li><li class="">Including a list</li><li class="">And also formatting in the signature</li></ul></div><br class=""><div class="">
<div class=""><br class="">Richard Olsson, tech lead<br class=""><br class=""><b class="">Zetkin Foundation<br class=""></b><a href="http://www.zetkin.org/en" class="">www.zetkin.org/en</a><br class=""><a href="mailto:info@zetkin.org" class="">info@zetkin.org</a><br class=""><br class=""><br class=""><br class=""><br class=""></div>

</div>
<br class=""></div></div></blockquote></div><br class=""></body></html>
--Apple-Mail=_19D75894-132F-4CB0-B342-B0A60D9F68B7--

`;
