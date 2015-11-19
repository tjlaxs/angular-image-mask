# angular-image-mask

Directive to draw lines and paths and masks over an image.


##Progress

Currently in version 0.0.1 with sort of proof of concept.


### Based on the *paths* object

* [x] Draw lines on the canvas
* [x] Draw polygons on the canvas
* [x] Draw rectangles on the canvas


### User interaction
* [x] Dragging of points
* [x] Basic control interface through the *config* attribute (this is very ugly)


## Build

To build the dist files do:
```
$ npm run build
```

To build the dist files and examples do:
```
$ npm run build:examples
```


## Install

Copy dist/* to a desired place. Add a dependency on 'tjlaxs.aim'
and use <canvas tjl-image-mask config="something"> where ever needed.

Optionally you can also add <tjl-image-mask-control config="something"/> to
add an ugly edit interface.


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
    name: 'Square',
    type: 'Rectangle',
    data: [[150, 30], [160, 610]]
  },
  {
    name: 'Area',
    type: 'Polygon',
    data: [[150, 30], [160, 610], [350, 230], [460, 310]]
  }
]
```

## Ugly control interfrace usage

1. To create a shape: Select a shape from the Mode list.
2. Add points by clicking around.
3. End creation of points by selecting another shape or edit mode from mode list.


