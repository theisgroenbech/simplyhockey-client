# Simply Hockey: Streaming Client

A small client that hooks into the Simply Hockey database and delivers automatic updates to text files usable in video streams.

## Install

First, clone the repo via git and install dependencies:

```bash
git clone git@github.com:theisgroenbech/simplyhockey-client.git
cd simplyhockey-client
yarn
```

## Starting Development

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a webpack dev server that sends hot updates to the renderer process:

```bash
yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```
