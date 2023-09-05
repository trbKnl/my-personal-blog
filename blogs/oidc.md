---
title: OIDC and OAuth2 a full example
date: 2023-09-01
description: A full example of an OIDC identity provider, a client and a proctedted API
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
    <img src="/secure_login_holding_hands.jpg" width="500" class="center">
</p>

<h2 class="border-bottom mb-3 mt-5">Key Content in this Blog Post</h2>

In this blog post, we will delve into two topics:

1. **OAuth2 and OpenID Connect (OIDC)**
2. **A Comprehensive Code Example** (with a client, an identity provider and a protected API)

If you're looking to grasp OAuth2 and OIDC, you can check out this excellent [video](https://www.youtube.com/watch?v=996OiexHze0).

Chances are, if you're working on web application authorization and authentication, you'll encounter OAuth2 and OIDC at some point. You might even consider implementing them in your own project. However, understanding these concepts and their implementation can be challenging due to the various components at play. These components include:

- The **Client Application**: This could be your web application.
- The **Identity Provider**: This is the server that manages user identities. It could be a well-known identity provider like Google ("Sign up with Google") or an identity provider specific to your organization.
- A **Protected Resource**: This refers to an API that restricts access to authorized users only.

Another essential aspect to grasp is the existence of different OIDC and OAuth2 flows. The choice of flow depends on your specific use case. For an overview of all possible flows, refer to [this resource](https://developer.okta.com/docs/concepts/oauth-openid/). In this blog post, we'll provide a detailed example of the authorization code flow with PKCE challenge, with the understanding that other flows share similar conceptual foundations.

In this blog post I will discuss a detailed example. If you want to learn what OIDC and OAuth2 are please check out the aforementioned video.

<h2 class="border-bottom mb-3 mt-5">Authorization code flow</h2>

Consider the following scenario: 

**scenario**

You have a client (web) application. Your web application does not know who the users are. The identity provider *does* know who the users are. Whenever someone wants to log into your client application through the browser, your client redirects them to the identity provider, the identity provider presents your user with a login screen, after a successful login the user gets redirected back to the client. The user is now logged in to your web application and can use your application as a logged in user.

This situation is very common and is good to have because it is a separation of responsibilities: your web app does not have to deal with authentication and authorization, a trusted (better suited) party does that for you.

**How does it work?**

But how does your web application know who the user is? And, subsequently, what that user is allowed to do? Well, after successful login the identity provider directs the user back to your client, this redirect includes a code (a large string). The web application can swap this code for a so-called access token at the identity provider. The swap does not happen in the browser, but server to server, which is considered to be more secure than through the browser. This access token has a set of "scopes" that determine what can be be done with the access token. The scope can be: "profile" if the access token has the scope "profile" the web app can go back to the identity provider with the access token and request profile information, such as the name of the person that logged in. The scope can also be something like: "read-access-for-my-api". If you have an API you want to protect, you can check all requests and see if they have an access token with the scope "read-access-for-my-api" if they have a valid access token with that scope, your API can give read access to the user.

In a diagram form, the flow is summarized as follows:

<p style="text-align:center;">
    <img src="/auth_code_flow.svg" width="600" class="center">
</p>

Great. But how do the client, the identity provider, and the protected resource actually communicate?

**https requests being send back and forth**

The communication happens through a bunch of https get and post requests with specific headers and bodies, it can be quite hard to figure out how these requests should be specified exactly, so below I gave the same flow, but now including request type (get or post) and what the headers should be (if applicable).

<p style="text-align:center;">
    <img src="/auth_code_flow_headers.svg" width="600" class="center">
</p>

Personally I really like this diagram, it shows exactly what you need to implement and what is being send back and forth.

<h2 class="border-bottom mb-3 mt-5">Code example</h2>

To make the example complete, you can now check out the complete code [example](https://github.com/trbKnl/oidc-authorization-code-example). This example is complete because it contains: a client, an API that checks if the access token is valid, and a configurable identity provider. I have not yet seen an example that provides all three components. 

The code is fully annotated an is supposed to be readable.

The client (web application) is written in FastAPI, and it perfectly shows why you want to use a web framework for a web application, because writing a web application without a web framework sucks. But it perfectly spells out exactly what the code does. Nothing is hidden in middle ware.

The API is also written in FastAPI, and that is where FastAPI actually does shine. 

For the identity provider, I relied upon an existing proprietary solution. The identity provider is free for personal projects such as these. 

All three components: the client, the API and the identity provider, need to run on local host. Check the GitHub repository for instruction. I assume you are using Linux or Max, or WSL on Windows, but code should work nonetheless. 
