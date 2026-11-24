// Minimal HTML sanitizer for release notes coming from the update feed.
// The desktop renderer has Node integration enabled, so untrusted markup must never reach innerHTML as is.
// The input is parsed into an inert document (nothing is executed or loaded) and rebuilt from an allow list
// of formatting tags; every attribute is dropped except a http(s) href on links.

const ALLOWED_TAGS = new Set([
    'A', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'CODE', 'PRE', 'KBD', 'P', 'BR', 'HR', 'SPAN', 'DIV',
    'UL', 'OL', 'LI', 'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'
]);

// Elements whose content must not be kept at all (not even as text).
const DROPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT', 'TEXTAREA', 'SELECT', 'SVG', 'MATH']);

function isSafeLink(href) {
    try {
        let protocol = new URL(href, 'https://github.com').protocol;
        return protocol === 'http:' || protocol === 'https:';
    }
    catch (e) {
        return false;
    }
}

function sanitizeHtml(html) {
    let source = new DOMParser().parseFromString('<!DOCTYPE html><body>' + String(html === undefined || html === null ? '' : html), 'text/html').body;
    let result = document.createElement('div');

    let copy = (from, to) => {
        for (let node of Array.from(from.childNodes)) {
            if (node.nodeType === 3) {
                to.appendChild(document.createTextNode(node.nodeValue));
            }
            else if (node.nodeType === 1) {
                let tag = node.tagName.toUpperCase();

                if (DROPPED_TAGS.has(tag)) continue;

                if (ALLOWED_TAGS.has(tag)) {
                    let el = document.createElement(tag.toLowerCase());

                    if (tag === 'A') {
                        let href = node.getAttribute('href');
                        if (href && isSafeLink(href)) {
                            el.setAttribute('href', href);
                            el.setAttribute('rel', 'noopener noreferrer');
                        }
                    }

                    copy(node, el);
                    to.appendChild(el);
                }
                else {
                    // unknown element: keep its (sanitized) children only
                    copy(node, to);
                }
            }
        }
    };

    copy(source, result);
    return result.innerHTML;
}

module.exports = sanitizeHtml;
