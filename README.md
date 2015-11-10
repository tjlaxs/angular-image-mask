# angular-image-mask
Directive to draw lines and paths and masks over an image.

## Build

To build the dist files do:
```
$ npm run build
```

## Install

Copy dist/* to a desired place. Add a dependency on 'tjlaxs.aim'
and use <canvas tjl-image-mask config="something"> where ever needed.

Optionally you can also add <tjl-image-mask-control config="something"/> to 

## Usage

<tjl-image-mask> has basically two attributes inside *config*
attribute: *config.control* and *config.shapes*. Look at
examples in the examples directory.

Control will hold variables to configure and control the drawer
 and shapes will hold an Javascript Array of Objects. Something
like:
```
[
  {
    name: 'Horizon',
    type: 'Line',
    data: [[30, 150], [610, 160]]
  },
  {
    name: 'Wall',
    type: 'Line',
    data: [[150, 30], [160, 610]]
  },
  {
    name: 'Area',
    type: 'Polygon',
    data: [[150, 30], [160, 610], [350, 230], [460, 310]]
  }
]
```
