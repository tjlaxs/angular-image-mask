# angular-image-mask

Directive to draw lines and paths and masks over an image.


##Progress
Currently in version 0.0.0 with sort of proof of concept.

### Based on the *paths* object
* [x] Draw lines on the canvas
* [ ] Draw polygons on the canvas
* [ ] Draw rectangles on the canvas

### User interaction
* [x] Dragging of points
* [ ] Basic control interface through the *config* attribute


## Build

To build the dist files do:
```
$ npm run build
```


## Install

Copy dist/* to a desired place. Add a dependency on 'tjlaxs.aim'
module and use <canvas tjl-image-mask> where ever needed.


## Usage

The directive has two attributes that it uses which are
 * *paths* to provide a model binding and
 * *config* to provide basic configuration. (Not implemented!)
 
Paths will hold an Javascript Array of Objects. Something like:
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
  }
]
```
