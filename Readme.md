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

While the dev mode is running, everything is stored in the '.tmp' folder. The . in the name makes the folder hidden. So you won't see it unless you have hidden files enabled. The scss files are done in a specific order.
There is a settings file that will contain a bunch of scss variables for different aspects of the email (brand, country). That file is then imported to the classes file, this is where the specific email scss goes. Then there is the '{{brand}}-global' scss file. This is where all the per brand scss is kept. The classes file (which contains settings as well from the import) is imported in to the per brand scss. This is so if the
brand changes you only need to change the one line of html (link tag).

### Build Task

Build task is the gulp task that allows the user to create a packaged and inlined HTML approved email. It moves all the html from the '.tmp' file then moves it to a dist folder and changes the scss to inlined css using a dependency called juice. It will also move different assets over such as pdf's and images.
