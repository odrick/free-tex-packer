# Free texture packer

![logo](https://raw.githubusercontent.com/odrick/free-tex-packer/master/electron/build/icons/96x96.png)

#

## IMPORTANT: I don't have time to imporove this app anymore. Only critical bugs will be fixed.

#

Free texture packer creates sprite sheets for you game or site. Rotation, trimming, multipacking, various export formats (json, xml, css, pixi.js, godot, phaser, cocos2d). Zip support. TinyPNG support. Split sheet tool.

![screenshot](https://free-tex-packer.com/wp-content/uploads/2019/01/screenshot.png)

Homepage: [https://free-tex-packer.com](https://free-tex-packer.com)

Web version: [https://free-tex-packer.com/app](https://free-tex-packer.com/app)

Desktop versions for win, mac, linux: [https://github.com/odrick/free-tex-packer/releases](https://github.com/odrick/free-tex-packer/releases)

Gulp module: [https://github.com/odrick/gulp-free-tex-packer](https://github.com/odrick/gulp-free-tex-packer)

Grunt plugin: [https://github.com/odrick/grunt-free-tex-packer](https://github.com/odrick/grunt-free-tex-packer)

Webpack plugin: [https://github.com/odrick/webpack-free-tex-packer](https://github.com/odrick/webpack-free-tex-packer)

CLI: [https://github.com/odrick/free-tex-packer-cli](https://github.com/odrick/free-tex-packer-cli)

# Custom templates
Free texture packer uses [mustache](http://mustache.github.io/) template engine.

There are 3 objects passed to template:

**rects** (Array) list of sprites for export

| prop             | type    | description                     |
| ---              | ---     | ---                             |
| name             | String  | sprite name                     |
| frame            | Object  | frame info (x, y, w, h, hw, hh) |
| rotated          | Boolean | sprite rotation flag            |
| trimmed          | Boolean | sprite trimmed flag             |
| spriteSourceSize | Object  | sprite source size (x, y, w, h) |
| sourceSize       | Object  | original size (w, h)            |
| first            | Boolean | first element in array flag     |
| last             | Boolean | last element in array flag      |

**config** (Object) current export config

| prop           | type    | description                        |
| ---            | ---     | ---                                |
| imageWidth     | Number  | texture width                      |
| imageHeight    | Number  | texture height                     |
| scale          | Number  | texture scale                      |
| format         | String  | texture format                     |
| imageName      | String  | texture name                       |
| imageFile      | String  | texture file (name with extension) |
| base64Export   | Boolean | base64 export flag                 |
| base64Prefix   | String  | prefix for base64 string           |
| imageData      | String  | base64 image data                  |

**appInfo** (Object) application info

| prop           | type    | description          |
| ---            | ---     | ---                  |
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


## 🌐 Web Resources & Interactive Index
- [CATEGORY JIGSAW](https://themindplaying.web.app/category-jigsaw.html)
- [TAP GALLERY](https://enskillcrafts.pages.dev/tap-gallery.html)
- [BEAUTY WORLD AND FASHION STYLIST](https://quizverses.pages.dev/beauty-world-and-fashion-stylist.html)
- [CAT CUT](https://thelearnquesters.pages.dev/cat-cut.html)
- [CANDY MAKER DESSERT GAMES](https://themindzone.pages.dev/candy-maker-dessert-games.html)
- [INDEX30](https://thelearnquesters.pages.dev/index30.html)
- [SLIME ATTACK PUZZLE](https://studyplayings.pages.dev/slime-attack-puzzle.html)
- [ALIEN INTELLIGENCE TEST](https://thequizzone.pages.dev/alien-intelligence-test.html)
- [BACKYARD DIG HOLE 3D SIMULATOR](https://studyplayings.web.app/backyard-dig-hole-3d-simulator.html)
- [MOJO EMOJI](https://studyplayings.web.app/mojo-emoji.html)
- [3 TILES](https://studyplayings.web.app/3-tiles.html)
- [VEGAMIX DA VINCI PUZZLES](https://studyplayings.web.app/vegamix-da-vinci-puzzles.html)
- [WORDMIX](https://studyplayings.web.app/wordmix.html)
- [SOKOBAN PUZZLE GAME](https://studyplayings.web.app/sokoban-puzzle-game.html)
- [CATEGORY DYKNOW](https://thequizzone.pages.dev/category-dyknow.html)
- [CHILDCARE MASTER ONLINE](https://studyplayings.web.app/childcare-master-online.html)
- [SUPERHEROES AND THE WAND](https://theskillquest.pages.dev/superheroes-and-the-wand.html)
- [BOLTS UNSCREW IT](https://studyplayings.web.app/bolts-unscrew-it.html)
- [TOWER STACK 2026](https://studyplayings.web.app/tower-stack-2026.html)
- [INDEX26](https://theskillquest.pages.dev/index26.html)
- [URUS CITY DRIVER](https://thelearnquesters.pages.dev/urus-city-driver.html)
- [SPRUNKI FIND THE DIFFERENCES](https://theskillquest.pages.dev/sprunki-find-the-differences.html)
- [PRINCESS RESCUE SAVE GIRL](https://studyplayings.web.app/princess-rescue-save-girl.html)
- [MURDER MYSTERY](https://themindzone.pages.dev/murder-mystery.html)
- [TAP BEAD](https://studyplayings.web.app/tap-bead.html)
- [CARS MERGE](https://studyplayings.web.app/cars-merge.html)
- [OBBY ESCAPE FROM TSUNAMI BRAINROT](https://studyplayings.web.app/obby-escape-from-tsunami-brainrot.html)
- [ONE HERO](https://studyplayings.web.app/one-hero.html)
- [TRAFFIC RUN PUZZLE](https://studyplayings.web.app/traffic-run-puzzle.html)
- [SPOTDIFFERS](https://studyplayings.web.app/spotdiffers.html)
- [CATEGORY INTERSTELLARPROXY](https://thequizzone.pages.dev/category-interstellarproxy.html)
- [COLOR STRINGS](https://studyplayings.web.app/color-strings.html)
- [WOODEN BOLTS AND NUTS](https://thelearnquesters.pages.dev/wooden-bolts-and-nuts.html)
- [TIED UP](https://thequizzone.pages.dev/tied-up.html)
- [COSMO PET STARRY CARE](https://thequizzone.pages.dev/cosmo-pet-starry-care.html)
- [SNIPER ASSASSIN GOVERNMENT AGENT](https://studyplayings.web.app/sniper-assassin-government-agent.html)
- [CRAZY GOOSE SIMULATOR](https://thelearnquesters.pages.dev/crazy-goose-simulator.html)
- [BFFS K POP FANGIRLS](https://studyplayings.web.app/bffs-k-pop-fangirls.html)
- [US ARMY CAR GAMES TRUCK DRIVING](https://theskillquest.pages.dev/us-army-car-games-truck-driving.html)
- [PERFECT CAKE MAKER](https://studyplayings.web.app/perfect-cake-maker.html)
- [JELLY RUN 2048](https://theskillquest.pages.dev/jelly-run-2048.html)
- [COZY GARDEN IDLE](https://studyplayings.web.app/cozy-garden-idle.html)
- [PUZZLE LUB](https://thelearnquesters.pages.dev/puzzle-lub.html)
- [BEAUTY WORLD AND FASHION STYLIST](https://thequizzone.pages.dev/beauty-world-and-fashion-stylist.html)
- [GHOST ESCAPE 3D](https://studyplayings.web.app/ghost-escape-3d.html)
- [VENETIAN LOVE AFFAIR](https://studyplayings.pages.dev/venetian-love-affair.html)
- [WATERMELON MERGE](https://studyplayings.web.app/watermelon-merge.html)
- [ZOMBIES WEAPON MERGE 4](https://studyplayings.pages.dev/zombies-weapon-merge-4.html)
- [THE SORT AGENCY](https://studyplayings.web.app/the-sort-agency.html)
- [HIGH HEELS 2](https://thequizzone.pages.dev/high-heels-2.html)
- [TILE FARM STORY MATCHING GAME](https://studyplayings.web.app/tile-farm-story-matching-game.html)
- [BIG BLOCK BLAST](https://themindzone.pages.dev/big-block-blast.html)
- [PIN MASTER](https://studyplayings.pages.dev/pin-master.html)
- [OFFICE BRAWL ROOM SMASH](https://studyplayings.web.app/office-brawl-room-smash.html)
- [MAHJONG LINES](https://theskillquest.pages.dev/mahjong-lines.html)
- [GOON BALL](https://studyplayings.pages.dev/goon-ball.html)
- [CRAZY BUS STATION](https://thelearnquesters.pages.dev/crazy-bus-station.html)
- [MAHJONG CONNECT COOKWARE](https://theskillquest.pages.dev/mahjong-connect-cookware.html)
- [SCARY BANBAN ESCAPE](https://studyplayings.pages.dev/scary-banban-escape.html)
- [BOMBARDINO CROCODILO TERROR JUMPSCARE](https://studyplayings.pages.dev/bombardino-crocodilo-terror-jumpscare.html)
- [ROBBY BOMBERMAN](https://studyplayings.pages.dev/robby-bomberman.html)
- [SNIPER ELITE 3D](https://thequizzone.pages.dev/sniper-elite-3d.html)
- [EGG HUNT MANIA](https://learnquester.github.io/egg-hunt-mania.html)
- [ARCHERY MASTER](https://studyplayings.pages.dev/archery-master.html)
- [SLIPPERY DRIFT RACING](https://thequizzone.pages.dev/slippery-drift-racing.html)
- [ITALIAN BRAINROT QUIZ](https://studyplayings.pages.dev/italian-brainrot-quiz.html)
- [CATEGORY AGILITY 2](https://learnquester.github.io/category-agility-2.html)
- [STICKMAN SANTA](https://thequizzone.pages.dev/stickman-santa.html)
- [CATEGORY PREMIUM PERKS74](https://thelearnquesters.pages.dev/category-premium-perks74.html)
- [MERGE FLOWERS](https://studyplayings.web.app/merge-flowers.html)
- [DRAW TO SMASH ZOMBIE](https://thequizzone.pages.dev/draw-to-smash-zombie.html)
- [CATEGORY MOBILE2 095](https://thelearnquesters.pages.dev/category-mobile2-095.html)
- [TRAFFIC COP 3D](https://studyplayings.pages.dev/traffic-cop-3d.html)
- [FOOTBALL HEADS 2025](https://studyplayings.web.app/football-heads-2025.html)
- [SPIDER BUBU](https://themindzone.pages.dev/spider-bubu.html)
- [IDLE DRIVE MERGE UPGRADE DRIVE](https://studyplayings.web.app/idle-drive-merge-upgrade-drive.html)
- [INDEX40](https://thequizzone.pages.dev/index40.html)
- [DIRTY MONEY THE RICH GET RICH](https://thequizzone.pages.dev/dirty-money-the-rich-get-rich.html)
- [MUSIC CAT PIANO TILES GAME 3D](https://themindzone.pages.dev/music-cat-piano-tiles-game-3d.html)
- [TILE GURU](https://thelearnquesters.pages.dev/tile-guru.html)
- [FUN SORTING THROUGH THE SHELVES](https://theskillquest.pages.dev/fun-sorting-through-the-shelves.html)
- [KNOCKOUT DUDES](https://theskillquest.pages.dev/knockout-dudes.html)
- [MERGE FELLAS ONLINE](https://studyplaying.github.io/merge-fellas-online.html)
- [MY CITY HOSPITAL](https://studyplaying.github.io/my-city-hospital.html)
- [JUST SLAP IT](https://themindzone.pages.dev/just-slap-it.html)
- [EMOJI FRENZY](https://theskillquest.pages.dev/emoji-frenzy.html)
- [SECRET ROOMS](https://studyplaying.github.io/secret-rooms.html)
- [ITALIAN BRAINROT BOMB 2PLAYER](https://thequizzone.pages.dev/italian-brainrot-bomb-2player.html)
- [CATEGORY SIMULATION](https://quizverses.github.io/category-simulation.html)
- [TOY RUMBLE 3D](https://theskillquest.pages.dev/toy-rumble-3d.html)
- [NO PAIN NO GAIN RAGDOLL SANDBOX](https://quizverses.pages.dev/no-pain-no-gain-ragdoll-sandbox.html)
- [SNAKE CLASH](https://thequizzone.pages.dev/snake-clash.html)
- [SORTING FROGS](https://studyquests.github.io/sorting-frogs.html)
- [DOWNTOWN PARKOUR DRIVE](https://thelearnquesters.pages.dev/downtown-parkour-drive.html)
- [THE SURVEY](https://studyquests.github.io/the-survey.html)
- [DREAM PET HOTEL](https://theskillquest.pages.dev/dream-pet-hotel.html)
- [SUPER KID ADVENTURE](https://studyplayings.web.app/super-kid-adventure.html)
- [CAR CARE REPAIR DUDU MECHANIC](https://theskillquest.pages.dev/car-care-repair-dudu-mechanic.html)
- [SAVE STRANDING FISH](https://themindzone.pages.dev/save-stranding-fish.html)
- [AUTHENTIC FOOTBALL](https://theskillquest.pages.dev/authentic-football.html)
- [CATEGORY PUZZLE 6](https://thelearnquesters.pages.dev/category-puzzle-6.html)
- [COP RUN 3D](https://theskillquest.pages.dev/cop-run-3d.html)
- [CATEGORY SNAKE40](https://theskillquest.pages.dev/category-snake40.html)
- [CATEGORY SCHOOL](https://thequizzone.pages.dev/category-school.html)
- [SCREW MASTERS 3D PUZZLE](https://thequizzone.pages.dev/screw-masters-3d-puzzle.html)
- [CATEGORY GROW99](https://quizverses.github.io/category-grow99.html)
- [JUMPER](https://themindzone.pages.dev/jumper.html)
- [ELLIE CHINESE NEW YEAR CELEBRATION](https://themindzone.pages.dev/ellie-chinese-new-year-celebration.html)
- [BOLTS](https://theskillquest.pages.dev/bolts.html)
- [FUNNY BALLS 2048](https://studyplayings.web.app/funny-balls-2048.html)
- [OBBY TSUNAMI ESCAPE 1 BY CAR](https://studyplaying.github.io/obby-tsunami-escape-1-by-car.html)
- [K POP HUNTERS VALENTINE STYLE](https://studyquests.github.io/k-pop-hunters-valentine-style.html)
- [CRAZY PLANE LANDING](https://thelearnquesters.pages.dev/crazy-plane-landing.html)
- [CATEGORY CUTE](https://themindzone.pages.dev/category-cute.html)
- [MONSTER COLLECT RUN](https://themindzone.pages.dev/monster-collect-run.html)
- [FALLING MAN](https://themindzone.pages.dev/falling-man.html)
- [CATEGORY CASUAL 9](https://thequizzone.pages.dev/category-casual-9.html)
- [SUMMER MAZE](https://studyquests.github.io/summer-maze.html)
- [ONET MONSTER BOOK](https://quizverses.pages.dev/onet-monster-book.html)
- [WEDNESDAY LIGHT ACADEMIA](https://thequizzone.pages.dev/wednesday-light-academia.html)
- [CUTE KITTY MERGE](https://quizverses.pages.dev/cute-kitty-merge.html)
- [CATEGORY STICKMAN](https://quizverses.github.io/category-stickman.html)
- [INDEX35](https://quizverses.github.io/index35.html)
- [SAFARI STORY MAHJONG](https://studyplaying.github.io/safari-story-mahjong.html)
- [CATEGORY SURVIVAL365](https://studyplaying.github.io/category-survival365.html)
- [HEXAGON](https://thequizzone.pages.dev/hexagon.html)
- [CATEGORY SOCCER 3](https://thelearnquesters.pages.dev/category-soccer-3.html)
- [ROYAL GARDEN MATCH 2](https://studyplayings.web.app/royal-garden-match-2.html)
- [CHRISTMAS FIND THE DIFFERENCES](https://studyplayings.pages.dev/christmas-find-the-differences.html)
- [QUIZ X](https://learnquester.github.io/quiz-x.html)
