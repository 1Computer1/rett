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
    raw(tagOrFlags, ...args) {
        if (re.isTemplateTag(tagOrFlags)) {
            const tag = tagOrFlags;
            return re.create(tag.raw, args, { escape: false });
        }

        return function _re(tag, ...subs) {
            const flags = tagOrFlags;
            const [, multiline] = args;
            return re.create(tag.raw, subs, { flags, multiline, escape: false });
        };
    },
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
        for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];
            const shouldEscape = sub[re.ignored] ? false : escape;
            subs[i] = shouldEscape ? re.escape(String(sub)) : String(sub);
        }

        let string;
        if (multiline) {
            const joined = [];
            for (let i = 0; i < raw.length; i++) {
                joined.push(raw[i].replace(/^\s+/gm, '').replace(/[\r\n]|\/\/.+/g, '').trim());
                joined.push(subs[i]);
            }

            string = joined.join('');
        } else {
            string = String.raw({ raw }, ...subs);
        }

        return new re.RegExp(string, flags);
    },
    escape(string, ...subs) {
        if (re.isTemplateTag(string)) {
            string = String.raw({ raw: string.raw }, ...subs);
        }

        return string.replace(re.specialEscapeRegex, '\\$&');
    },
    ignore(string, ...subs) {
        if (re.isTemplateTag(string)) {
            string = String.raw({ raw: string.raw }, ...subs);
        }

        // A String instance is used here to be able to add a new property on it.
        const str = new String(string); // eslint-disable-line no-new-wrappers
        str[re.ignored] = true;
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
    ignored: Symbol('ignored'),
    specialEscapeRegex: /[|\\{()[^$+*?.-]/g,
    RegExp: RegExp
};

Object.defineProperties(re, Object.getOwnPropertyNames(namespace).reduce((obj, name) => {
    const desc = Object.getOwnPropertyDescriptor(namespace, name);
    obj[name] = desc;
    return obj;
}, {}));

module.exports = re;
