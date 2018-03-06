# Free texture packer

Free texture packer creates sprite sheets for you game or site. Rotation, trimming, multipacking, various export formats (json, xml, css, pixi.js, phaser, cocos2d). Zip support. TinyPNG support.

Live version: [http://free-tex-packer.com](http://free-tex-packer.com)

Gulp module: [https://github.com/odrick/gulp-free-tex-packer](https://github.com/odrick/gulp-free-tex-packer)

# Custom templates
Free texture packer uses [mustache](http://mustache.github.io/) template engine.

There are 3 objects passed to template:

**rects** (Array) list of sprites for export
| prop             | type    | description                     |
| -------------    |---------|-------------                    |
| name             | String  | sprite name                     |
| frame            | Object  | frame info (x, y, w, h, hw, hh) |
| rotated          | Boolean | sprite rotation flag            |
| trimmed          | Boolean | sprite trimmed flag             |
| spriteSourceSize | Object  | sprite source size (x, y, w, h) |
| sourceSize       | Object  | original size (w, h)            |
| first            | Boolean | first element in array flag     |
| last             | Boolean | last element in array flag      |

**config** (Object) currect export config
| prop           | type    | description              |
| -------------  |---------|-------------             |
| imageWidth     | Number  | texture width            |
| imageHeight    | Number  | texture height           |
| scale          | Number  | texture scale            |
| format         | String  | texture format           |
| imageName      | String  | texture name             |
| base64Export   | Boolean | base64 export flag       |
| base64Prefix   | String  | prefix for base64 string |
| imageData      | String  | base64 image data        |

**appInfo** (Object) application info
| prop           | type    | description          |
| -------------  |---------|-------------         |
| displayName    | String  | App name             |
| version        | String  | App version          |
| url            | String  | App url              |

**Example:**
```
{
  "frames": {
    {{#rects}}
    "{{{name}}}": {
      "frame": {
        "x": {{frame.x}},
        "y": {{frame.y}},
        "w": {{frame.w}},
        "h": {{frame.h}}
      },
      "rotated": {{rotated}},
      "trimmed": {{trimmed}},
      "spriteSourceSize": {
        "x": {{spriteSourceSize.x}},
        "y": {{spriteSourceSize.y}},
        "w": {{spriteSourceSize.w}},
        "h": {{spriteSourceSize.h}}
      },
      "sourceSize": {
        "w": {{sourceSize.w}},
        "h": {{sourceSize.h}}
      },
      "pivot": {
        "x": 0.5,
        "y": 0.5
      }
    }{{^last}},{{/last}}
    {{/rects}}
  },
  "meta": {
    "app": "{{{appInfo.url}}}",
    "version": "{{appInfo.version}}",
    "image": "{{config.imageName}}",
    "format": "{{config.format}}",
    "size": {
      "w": {{config.imageWidth}},
      "h": {{config.imageHeight}}
    },
    "scale": {{config.scale}}
  }
}
```