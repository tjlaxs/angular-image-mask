# angular-image-mask
Directive to draw lines and paths and masks over an image.

## Build

To build the dist files do:
```
$ npm run build
```

## Install

Copy dist/* to a desired place. Add a dependency on 'tjlaxs.aim'
and use <tjl-image-mask> where ever needed.

## Usage

<tjl-image-mask> has basically two attributes: *src* and *paths*.

Src attribute will hold the background image location and paths
will hold an Javascript Array of Objects. Something like:
```
[
  {
    name: 'Horizon',
    type: 'Line',
    data: [30, 150, 610, 160]
  },
  {
    name: 'Wall',
    type: 'Line',
    data: [150, 30, 160, 610]
  }
]
```
