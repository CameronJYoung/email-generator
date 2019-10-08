# Approved email generator

The idea of this project is to be able to easily generate an emea email based on the brand and country
then allow the user to make changes to it in a development mode.

## Getting started

### Prerequesites

In order to install and use this project you need to install node and npm.
My current versions are:
> node : v8.15.1

> npm : v6.4.1

### Installation

All you need to do to install dependencies on this project is run:
```
npm i
```

## How to use?

### Dev mode

Dev mode is a gulp task that allows you to make changes to generate then make changes to an approved
email. It uses browserSync to run a server with the email on and update changes when something in the src file is changed. Also, when in dev mode rather than inlining all the css during the dev task I am only using normal css sytylesheets in order to make the dev task faster.

While the dev mode is running, everything is stored in the '.tmp' folder. The . in the name makes the folder hidden. So you won't see it unless you have hidden files enabled.
