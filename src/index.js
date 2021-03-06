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
    specialEscapeRegex: /[|\\{}()[^$+*?.\]-]/g,

    options: {
        debug: false,
        escape: true,
        multiline: false,
        flags: {
            default: '',
            addition: ''
        }
    },

    raw(string, ...args) {
        if (re.isTemplateTag(string)) {
            return re('', false)(string, ...args);
        }

        args[0] = args[0] !== undefined ? args[0] : false;
        return re(string, ...args);
    },

    line(string, ...args) {
        if (re.isTemplateTag(string)) {
            return re('', true, true)(string, ...args);
        }

        args[1] = args[1] !== undefined ? args[1] : true;
        return re(string, ...args);
    },

    create(raw, subs, { flags = '', escape = re.options.escape, multiline = re.options.multiline } = {}) {
        for (let i = 0; i < subs.length; i++) {
            const sub = subs[i];
            const shouldEscape = sub[re.ignored] ? false : escape;
            subs[i] = shouldEscape ? re.escape(String(sub)) : String(sub);
        }

        let string;
        if (multiline) {
            const joined = [];
            for (let i = 0; i < raw.length; i++) {
                joined.push(raw[i].replace(/\s*?\/\/.+/g, '').replace(/[\r\n]+\s*/g, ''));
                joined.push(subs[i]);
            }

            string = joined.join('').trim();
        } else {
            string = String.raw({ raw }, ...subs);
        }

        if (!flags) flags = re.options.flags.default;
        flags += [...re.options.flags.addition].filter(f => !flags.includes(f)).join('');

        const regex = new re.RegExp(string, flags);
        if (re.options.debug) console.dir(regex);
        return regex;
    },

    escape(string, ...subs) {
        if (re.isTemplateTag(string)) {
            string = String.raw({ raw: string.raw }, ...subs);
        }

        return string.replace(re.specialEscapeRegex, '\\$&');
    },

    unescape(string, ...subs) {
        if (re.isTemplateTag(string)) {
            string = String.raw({ raw: string.raw }, ...subs);
        }

        return string.replace(new RegExp(`\\\\(${re.specialEscapeRegex.source})`, 'g'), '$1');
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
