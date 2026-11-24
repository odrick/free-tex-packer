// Consistency checks for the localization files.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src/client/resources/static/localization');
const languages = require(path.join(dir, 'languages.json'));
const pkg = require('../package.json');

function parse(file) {
    const entries = [];
    for (const line of fs.readFileSync(path.join(dir, file), 'utf8').split(/\r?\n/)) {
        if (!line.trim()) continue;
        const i = line.indexOf(';');
        assert.ok(i > 0, `${file}: malformed line "${line}"`);
        entries.push([line.slice(0, i), line.slice(i + 1)]);
    }
    return entries;
}

const count = (s, re) => (s.match(re) || []).length;
const en = new Map(parse('en.csv'));
const csvLangs = fs.readdirSync(dir).filter(f => f.endsWith('.csv')).map(f => f.replace(/\.csv$/, '')).sort();

test('languages.json, localization files and package.json agree', () => {
    const fromJson = languages.map(l => l.lang).sort();
    assert.deepStrictEqual(csvLangs, fromJson, 'languages.json vs *.csv');
    assert.deepStrictEqual([...pkg.localizations].sort(), fromJson, 'package.json "localizations" vs languages.json');
    assert.strictEqual(languages[0].lang, 'en', 'English must stay the first (default) language');
});

for (const lang of csvLangs) {
    test(`locale ${lang}: same keys and placeholders as en`, () => {
        const entries = parse(`${lang}.csv`);
        const map = new Map(entries);

        assert.deepStrictEqual([...map.keys()].sort(), [...en.keys()].sort(), 'key set differs from en.csv');

        const dups = entries.map(e => e[0]).filter((k, i, a) => a.indexOf(k) !== i);
        assert.deepStrictEqual([...new Set(dups)].filter(k => k !== 'SCALE'), [], 'duplicate keys');

        for (const [key, value] of map) {
            assert.ok(value.trim().length > 0 || en.get(key).trim().length === 0, `${key} is empty`);
            assert.strictEqual(count(value, /%s/g), count(en.get(key), /%s/g), `${key}: %s placeholders differ from en`);
        }
    });
}
