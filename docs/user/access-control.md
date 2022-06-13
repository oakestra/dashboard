# Access control

Once Dashboard is installed and accessible we can focus on configuring access control to the resources for users.

When the framework is started for the first time, an admin user is automatically created. 
This admin user can be used to create additional users.

**IMPORTANT:** Make sure that the Admin password is changed after the first start of the System Manager.

## Introduction

EdgeIO supports currently only one way of authenticating and authorizing users.
Authorization is handled by the Root Orchestrator (System Manager) API server.
The Dashboard only acts as a proxy and passes all auth information to it. 
In case of forbidden access corresponding warnings will be displayed in the Dashboard.

## Authentication

EdgeIO Dashboard supports currently only this way of authenticating users:

* [Username/password](#basic) that can be used on Dashboard login view.

After a user is logged in, tokens in the authorization header are used to authenticate the user.

### Authorization header

Using authorization header is the only way to make Dashboard act as a specific user. 
Note that there are some risks if plain HTTP is used since the traffic is vulnerable to [MITM attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).

To make Dashboard use authorization header you simply need to pass `Authorization: Bearer <token>` in every request to Dashboard. 
This is currently done automatically with an HTTP interceptor.

To quickly test it check out [Requestly](https://chrome.google.com/webstore/detail/requestly-redirect-url-mo/mdnleldcmiljblolnjhpnblkcekpdkpa) Chrome browser plugin that allows to manually modify request headers.

## Admin privileges

**IMPORTANT:** Make sure that you know what you are doing before proceeding. Granting admin privileges to Dashboard's Service Account might be a security risk.

