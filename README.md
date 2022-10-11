ap-client
======

This repository contains the front-end code for the appointpal application.

### Before you install

This project uses node v8.6.0 and npm v5.3.0 for bundling JavaScript and CSS

Make sure you have these versions installed, or use nvm to set your local environment appropriately.

### Building the static assets

1. Clone the repository
2. Run `npm install`
3. Create a `variables.less` file in the `./less` directory.  (You can simply copy one of the templates.)
4. Run `gulp buildLess` to compile the CSS (outputs to `./css/build`)
5. Run `gulp buildScripts` to compile the JavaScript (outputs to `./bundles`)

### Link the static assets to appointpal

1. Create a symbolic link to `[ap-client-root]/css/build` from `[appointpal-root]/qoopt/static/css`
2. Create a symbolic link to `[ap-client-root]/bundles` from `[appointpal-root]/qoopt/static`
