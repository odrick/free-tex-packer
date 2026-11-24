# Free texture packer

![logo](https://raw.githubusercontent.com/odrick/free-tex-packer/master/electron/build/icons/96x96.png)

---

## IMPORTANT: I no longer have time to improve this app. Only critical bugs will be fixed.

---

Free texture packer creates sprite sheets for your game or site. It supports rotation, trimming, multipacking and various export formats (JSON, XML, CSS, pixi.js, Godot, Phaser, cocos2d), can load images from ZIP archives, and includes a sheet splitting tool. TinyPNG compression is available in the desktop version.

Web version: [https://odrick.github.io/free-tex-packer/](https://odrick.github.io/free-tex-packer/)

Desktop versions for Windows, macOS and Linux: [https://github.com/odrick/free-tex-packer/releases](https://github.com/odrick/free-tex-packer/releases)

Gulp module: [https://github.com/odrick/gulp-free-tex-packer](https://github.com/odrick/gulp-free-tex-packer)

Grunt plugin: [https://github.com/odrick/grunt-free-tex-packer](https://github.com/odrick/grunt-free-tex-packer)

Webpack plugin: [https://github.com/odrick/webpack-free-tex-packer](https://github.com/odrick/webpack-free-tex-packer)

CLI: [https://github.com/odrick/free-tex-packer-cli](https://github.com/odrick/free-tex-packer-cli)

# Custom templates
Free texture packer uses the [mustache](https://mustache.github.io/) template engine.

Three objects are passed to the template:

**rects** (Array): list of sprites to export

| property         | type    | description                         |
| ---              | ---     | ---                                 |
| name             | String  | sprite name                         |
| frame            | Object  | frame info (x, y, w, h, hw, hh)     |
| rotated          | Boolean | true if the sprite is rotated       |
| trimmed          | Boolean | true if the sprite is trimmed       |
| spriteSourceSize | Object  | sprite source size (x, y, w, h)     |
| sourceSize       | Object  | original size (w, h)                |
| first            | Boolean | true for the first element of array |
| last             | Boolean | true for the last element of array  |

**config** (Object): current export configuration

| property       | type    | description                          |
| ---            | ---     | ---                                  |
| imageWidth     | Number  | texture width                        |
| imageHeight    | Number  | texture height                       |
| scale          | Number  | texture scale                        |
| format         | String  | texture pixel format (e.g. RGBA8888) |
| imageName      | String  | texture name                         |
| imageFile      | String  | texture file name (with extension)   |
| base64Export   | Boolean | true if base64 export is enabled     |
| base64Prefix   | String  | prefix for the base64 string         |
| imageData      | String  | base64 image data                    |

**appInfo** (Object): application info

| property       | type    | description          |
| ---            | ---     | ---                  |
| displayName    | String  | app name             |
| version        | String  | app version          |
| url            | String  | app URL              |

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
    "image": "{{config.imageFile}}",
    "format": "{{config.format}}",
    "size": {
      "w": {{config.imageWidth}},
      "h": {{config.imageHeight}}
    },
    "scale": {{config.scale}}
  }
}
```
