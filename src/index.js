const ignored = Symbol('ignored');

function re(tagOrFlags, ...args) {
    if (re.isTemplateTag(tagOrFlags)) {
        const tag = tagOrFlags;
        return re.create(tag.raw, args);
    }

    return function _re(tag, ...subs) {
        const flags = tagOrFlags;
        const [escape, multiline] = args;
        return re.create(tag.raw, subs, { flags, escape, multiline });
    };
}

const namespace = {
    line(tagOrFlags, ...args) {
        if (re.isTemplateTag(tagOrFlags)) {
            const tag = tagOrFlags;
            return re.create(tag.raw, args, { multiline: true });
        }

        return function _re(tag, ...subs) {
            const flags = tagOrFlags;
            const [escape] = args;
            return re.create(tag.raw, subs, { flags, escape, multiline: true });
        };
    },
    create(raw, subs, { flags = '', escape = true, multiline = false } = {}) {
        raw = raw.slice(0);

        if (multiline) {
            for (let i = 0; i < raw.length; i++) {
                const str = raw[i];
                raw[i] = str.replace(/^\s+/gm, '').replace(/[\r\n]+|\/\/.+/g, '').trim();
            }
        }

        for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];
            const shouldEscape = sub[ignored] ? false : escape;
            subs[i] = shouldEscape ? re.escape(String(sub)) : String(sub);
        }

        return new re.RegExp(String.raw({ raw }, ...subs), flags);
    },
    escape(string, ...subs) {
        if (Array.isArray(string) && string.raw) {
            string = String.raw({ raw: string.raw }, ...subs);
        }

        return string.replace(re.specialEscapeRegex, '\\$&');
    },
    ignore(string, ...subs) {
        if (Array.isArray(string) && string.raw) {
            string = String.raw({ raw: string.raw }, ...subs);
        }

        // A String instance is used here to be able to add a new property on it.
        const str = new String(string); // eslint-disable-line no-new-wrappers
        str[ignored] = true;
        return str;
    },
    isTemplateTag(item) {
        if (!Array.isArray(item) || !item.raw) return false;

        const desc = Object.getOwnPropertyDescriptor(item, 'raw');
        if (desc.writable || desc.configurable || desc.enumerable) {
            return false;
        }

        return true;
    },
    specialEscapeRegex: /[|\\{()[^$+*?.-]/g,
    RegExp: RegExp
};

Object.defineProperties(re, Object.getOwnPropertyDescriptors(namespace));
module.exports = re;
