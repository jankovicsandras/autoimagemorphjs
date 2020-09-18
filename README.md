
![alt Automatic Image Morphing logo](f.gif)

# autoimagemorphjs / aimjs : Automatic image morphing

### Version 0.1.0
### This is a Node.js command line application (for now).
#### This is a work in progress. Expect major refactoring, where the core functions will be split to a platform-independent JavaScript file (to target the browser) and a separate Node.js PNG I/O and command line parsing program. 

autoimagemorphjs is a new implementation of the automatic image morphing process, based on lessons learned from https://github.com/jankovicsandras/autoimagemorph/ . It produces similar results, but the calculation is much more simple, much faster and the program has no dependencies (apart from the current Node.js PNG I/O, which will be separated).

## Dependencies

https://github.com/lukeapage/pngjs  currently, used for PNG I/O. Expect that this will be split to allow other Node.js image I/O libraries and to support the browser, where image I/O is built-in.

I recommend downloading to the same folder or editing Line 4 in ```aimjs.js``` : ```PNG = require("./pngjs-master/lib/png").PNG;```

## Usage

This program expects two JSON-like arrays as command line arguments. The arrays can't have spaces or other whitespace characters and use single quotes ```'``` , not double quotes ```"```. The first array is a list of filename strings, the input keyframe images. The second array is a list of options:

```[output_filename_prefix,framerate,feature_grid_width,feature_grid_height,subpixel_processing,png_opts]```

 ```output_filename_prefix``` : REQUIRED string with single quotes ```'```
 ```framerate``` : optional integer, default = 30
 ```feature_grid_width``` : optional integer, default = 6
 ```feature_grid_height``` : optional integer, default = 6
 ```subpixel_processing``` : optional integer, default = 2
 ```png_opts``` : optional object, see https://github.com/lukeapage/pngjs
 
## Example

```node aimjs ['vg0.png','vg30.png','vg60.png','vg0.png'] ['f',30,6,6,2]```

Expected output:

```
f0.png saved.
f1.png saved.
f2.png saved.
f3.png saved.
...
```
----

```node aimjs```

Prints help.

## Warning
Be careful when using the required ```output_filename_prefix``` parameter.  The program overwrites ```<output_filename_prefix><sequencenumber>.png``` files without warning. ```f0.png``` , ```f1.png```, ... ```f89.png``` will be overwritten in the example above.

### Recommended postprocessing
Install FFmpeg:  https://ffmpeg.org/

```ffmpeg -framerate 30 -i f%d.png f.gif```

## TODO:
- browser support, split out https://github.com/lukeapage/pngjs to allow other Node.js image I/O libraries
- built-in bilinear, cubic, etc. sampling? Currently it's only subpixel nearest-neighbor.
- built-in animgif, video export?

## License
### The Unlicense / PUBLIC DOMAIN

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to [http://unlicense.org](http://unlicense.org)
