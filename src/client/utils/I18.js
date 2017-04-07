import { GET } from './ajax';

let _currentLocale = "en";
let _supportedLanguages = ["en"];
let _strings = {};
let _path = "localization";
let _iniPrefix = "";
let _iniExt = "csv";
let _iniSeparator = ";";
let _parser = null;

class I18 {

    static get currentLocale() {
        return _currentLocale;
    }
    static set currentLocale(val) {
        _currentLocale = val;
    }

    static get supportedLanguages() {
        return _supportedLanguages;
    }
    static set supportedLanguages(val) {
        _supportedLanguages = val;
    }

    static get strings() {
        return _strings;
    }
    static set strings(val) {
        _strings = val;
    }

    static get path() {
        return _path;
    }
    static set path(val) {
        _path = val;
    }

    static get iniPrefix() {
        return _iniPrefix;
    }
    static set iniPrefix(val) {
        _iniPrefix = val;
    }

    static get iniExt() {
        return _iniExt;
    }
    static set iniExt(val) {
        _iniExt = val;
    }

    static get iniSeparator() {
        return _iniSeparator;
    }
    static set iniSeparator(val) {
        _iniSeparator = val;
    }

    static get parser() {
        return _parser;
    }
    static set parser(val) {
        _parser = val;
    }

    static init(locale=null) {
	    let lang = window.navigator.userLanguage || window.navigator.language || "";
		if (!locale) locale = lang.substr(0, 2);
	    if(I18.supportedLanguages.indexOf(locale) < 0) locale = I18.supportedLanguages[0];
	    
	    I18.currentLocale = locale;
	}

    static parse(data) {
        let strings = {};

        if(I18.parser) {
            strings = I18.parser(data);
        }
        else {
            let parts = data.split("\n"), keyVal;

            for(let part of parts) {
                keyVal = part.split(I18.iniSeparator);
                if(keyVal[0].trim()) strings[keyVal[0].trim()] = keyVal[1].trim();
            }
        }

        return strings;
    }

    static createLoaderQueue() {
        let queue = new Queue();
        let loader = createLoader(I18.path + "/" + I18.iniPrefix + I18.currentLocale + "." + I18.iniExt + "?v=" + (new Date().getTime()), this.context);
        queue.add(loader);

        queue.on('fileload', (e) => {
            I18.setup(I18.parse(e.item.data));
        });

        return queue;
    }

    static load(callback) {
        let url = I18.path + "/" + I18.iniPrefix + I18.currentLocale + "." + I18.iniExt + "?v=" + (new Date().getTime());
        GET(url, null, data => {
            I18.setup(I18.parse(data));
            if(callback) callback();
        });
    }
	
    static setup(data) {
		I18.strings = data;
	}

    static trim(s) {
	    return s.trim();
	}

    static arrayAntidot(values) {
        if (!values) return;
        if (values.length > 0 && Array.isArray(values[0])) return values[0];
        return values;
    }

    static getString(key, values) {
		if (typeof values == "undefined") values = null;

		let str = I18.getStringOrNull(key, values);
		if (str == null) return "{" + key + "}";
		
		return str;
	}

    static getStringOrNull(key, args)
	{
		if (typeof args == "undefined") args = null;

		let value = I18.strings[key];
		if (typeof value == "undefined") value = null;
		
		if(args == null || value == null) return value;
		else {
		    args = [value].concat(I18.arrayAntidot(args));
		    return I18.sprintf.apply(I18, args);
		}
	}

    static f(key, ...values) {
		return I18.getString(key, values);
	}

    static s(prefix, key, values) {
		if (!Array.isArray(values)) values = [values];
		return I18.getString(prefix + "_" + key, I18.arrayAntidot(values));
	}

    static sf(key, suffix, values) {
		return I18.getString(key + "_" + suffix, I18.arrayAntidot(values));
	}

    static psf(prefix, key, suffix, values)	{
		return I18.getString(prefix + "_" + key + "_" + suffix, I18.arrayAntidot(values));
	}

    static sprintf(...values) {
        let regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
        let a = values;
        let i = 0;
        let format = a[i++];

        let pad = function(str, len, chr, leftJustify) {
            if (!chr) chr = ' ';
            let padding = (str.length >= len) ? '' : new Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };

        let justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            let diff = minWidth - value.length;
            if (diff > 0)
            {
                if (leftJustify || !zeroPad) value = pad(value, minWidth, customPadChar, leftJustify);
                else value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
            return value;
        };

        let formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            let number = value >>> 0;
            prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };

        let formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) value = value.slice(0, precision);
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };

        let doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
            let number, prefix, method, textTransform, value;
    
            if (substring === '%%') return '%';

            let leftJustify = false;
            let positivePrefix = '';
            let zeroPad = false;
            let prefixBaseX = false;
            let customPadChar = ' ';
            let flagsl = flags.length;
            for (let j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j))
                {
                    case ' ':
                        positivePrefix = ' ';
                        break;
                    case '+':
                        positivePrefix = '+';
                        break;
                    case '-':
                        leftJustify = true;
                        break;
                    case "'":
                        customPadChar = flags.charAt(j + 1);
                        break;
                    case '0':
                        zeroPad = true;
                        customPadChar = '0';
                        break;
                    case '#':
                        prefixBaseX = true;
                        break;
                }
            }
    
            if (!minWidth) minWidth = 0;
            else if (minWidth === '*') minWidth = +a[i++];
            else if (minWidth.charAt(0) == '*') minWidth = +a[minWidth.slice(1, -1)];
            else minWidth = +minWidth;
    
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }
    
            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }
    
            if (!precision) precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
            else if (precision === '*') precision = +a[i++];
            else if (precision.charAt(0) == '*') precision = +a[precision.slice(1, -1)];
            else  precision = +precision;
    
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
    
            switch (type) {
                case 's':
                    return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                case 'c':
                    return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                case 'b':
                    return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o':
                    return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
                case 'u':
                    return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'i':
                case 'd':
                    number = +value || 0;
                    number = Math.round(number - number % 1);
                    prefix = number < 0 ? '-' : positivePrefix;
                    value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad);
                case 'e':
                case 'E':
                case 'f':
                case 'F':
                case 'g':
                case 'G':
                    number = +value;
                    prefix = number < 0 ? '-' : positivePrefix;
                    method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                    textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                    value = prefix + Math.abs(number)[method](precision);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                default:
                    return substring;
            }
        };
    
        return format.replace(regex, doFormat);
    }
}

export default I18;