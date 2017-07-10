function re(string, ...args) {
    if (re.isTemplateTag(string)) {
        return re.create(string.raw, args);
    }

    return function _re(tag, ...subs) {
        const [escape, multiline] = args;
        return re.create(tag.raw, subs, {
            escape,
            multiline,
            flags: string
        });
    };
}

const namespace = {
    RegExp,
    ignored: Symbol('ignored'),
    specialEscapeRegex: /[|\\{()[^$+*?.-]/g,

    raw(string, ...args) {
        if (re.isTemplateTag(string)) {
            return re('', false)(string, ...args);
        }

        args[0] = false;
        return re(string, ...args);
    },

    line(string, ...args) {
        if (re.isTemplateTag(string)) {
            return re('', true, true)(string, ...args);
        }

        args[1] = true;
        return re(string, ...args);
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

    join(arr, char = '|') {
        const joined = [];
        for (const str of arr) {
            joined.push(str[re.ignored] ? String(str) : re.escape(String(str)));
        }

        return re.ignore(joined.join(char));
    },

    isTemplateTag(item) {
        if (!Array.isArray(item) || !item.raw) return false;

        const desc = Object.getOwnPropertyDescriptor(item, 'raw');
        if (desc.writable || desc.configurable || desc.enumerable) {
            return false;
        }

        return true;
    }
};

Object.assign(re, namespace);
module.exports = re;
