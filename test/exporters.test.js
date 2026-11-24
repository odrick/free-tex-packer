// Snapshot tests for the exporter templates.
// Run `UPDATE_SNAPSHOTS=1 npm test` to (re)generate test/__snapshots__ after an intended change.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');
const wax = require('@jvitela/mustache-wax');
const formatters = require('../src/client/exporters/formatters');
const list = require('../src/client/exporters/list.json');

wax(mustache);
mustache.Formatters = formatters;

const root = path.join(__dirname, '..');
const templatesDir = path.join(root, 'src/client/resources/static/exporters');
const snapshotsDir = path.join(__dirname, '__snapshots__');

// Fixed app info, so that snapshots do not change with every version bump.
const appInfo = {displayName: 'Free texture packer', version: '0.6.7', url: 'https://github.com/odrick/free-tex-packer'};
const names = ['a.png', 'dir/b & c.png', 'q"uo<te>.png', "it's:50%#1;x.png"];

// Mirrors what prepareData() in src/client/exporters/index.js hands to the templates.
function makeData(scale, trimMode, prepend, removeExt) {
    const rects = names.map((n, i) => {
        let name = removeExt ? n.replace(/\.[^.]+$/, '') : n;
        if (!prepend) name = name.split('/').pop();
        const frame = {x: i * 10 + 1, y: i * 7, w: 32 + i, h: 17 + i};
        frame.hw = frame.w / 2;
        frame.hh = frame.h / 2;
        for (const k of Object.keys(frame)) frame[k] *= scale;
        return {
            name,
            frame,
            spriteSourceSize: {x: i, y: 2 * i, w: 30, h: 15},
            sourceSize: {w: 40, h: 20},
            rotated: i % 2 === 1,
            trimmed: trimMode !== 'crop' && i !== 0
        };
    });
    rects[0].first = true;
    rects[rects.length - 1].last = true;
    return {
        rects,
        config: {
            imageName: 'texture', imageFile: 'texture.png', format: 'RGBA8888', scale, textureFormat: 'png',
            base64Prefix: 'data:image/png;base64,', width: 256, height: 128, trimMode,
            prependFolderName: prepend, removeFileExtension: removeExt, base64Export: false,
            powerOfTwo: true, allowRotation: true, allowTrim: true, padding: 2, extrude: 1
        },
        appInfo
    };
}

const variants = {
    v1: makeData(1, 'trim', true, false),
    v2: makeData(0.5, 'crop', false, true)
};

for (const exporter of list.filter(e => e.template)) {
    for (const [variant, data] of Object.entries(variants)) {
        test(`exporter ${exporter.type} (${exporter.template}) / ${variant}`, () => {
            const template = fs.readFileSync(path.join(templatesDir, exporter.template), 'utf8');
            const actual = mustache.render(template, data);
            const file = path.join(snapshotsDir, `${exporter.template}.${variant}.txt`);

            if (process.env.UPDATE_SNAPSHOTS) {
                fs.mkdirSync(snapshotsDir, {recursive: true});
                fs.writeFileSync(file, actual);
                return;
            }

            assert.ok(fs.existsSync(file), `missing snapshot ${path.relative(root, file)}; run with UPDATE_SNAPSHOTS=1`);
            assert.strictEqual(actual, fs.readFileSync(file, 'utf8'));
        });
    }
}

test('every template listed in list.json exists', () => {
    for (const exporter of list.filter(e => e.template)) {
        assert.ok(fs.existsSync(path.join(templatesDir, exporter.template)), exporter.template);
    }
});

test('every template file is listed in list.json', () => {
    const listed = new Set(list.filter(e => e.template).map(e => e.template));
    for (const file of fs.readdirSync(templatesDir)) {
        assert.ok(listed.has(file), `${file} is not used by any exporter`);
    }
});

test('formatters', () => {
    assert.strictEqual(formatters.add(1, 2), 3);
    assert.strictEqual(formatters.subtract(5, 2), 3);
    assert.strictEqual(formatters.multiply(3, 4), 12);
    assert.strictEqual(formatters.divide(9, 3), 3);
    assert.strictEqual(formatters.mirror(2, 3, 10), 5);
    assert.strictEqual(formatters.offsetLeft(10, 20, 8), 16);
    assert.strictEqual(formatters.offsetRight(10, 20, 8), -16);
    assert.strictEqual(formatters.escapeName('a%b#c:d;e\\f/g'), 'a%25b%23c%3Ad%3Be-f-g');
});
