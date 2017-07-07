const ignored = Symbol('ignored');

function re(tagOrFlags, ...args) {
    if (Array.isArray(tagOrFlags) && tagOrFlags.raw) {
        const tag = tagOrFlags;
        return re.create(tag.raw, args, '', true);
    }

    return function _re(string, ...subs) {
        const flags = tagOrFlags;
        const [escape] = args;
        return re.create(string.raw, subs, { flags, escape });
    };
}

re.create = function create(raw, subs, { flags = '', escape = true }) {
    const escaped = [];
    for (const item of subs) {
        const shouldEscape = item[ignored] ? false : escape;
        escaped.push(shouldEscape ? re.escape(String(item)) : String(item));
    }

    return new re.RegExp(String.raw({ raw }, ...escaped), flags);
};

re.escape = function escape(string, ...subs) {
    if (Array.isArray(string) && string.raw) {
        string = String.raw({ raw: string.raw }, ...subs);
    }

    return string.replace(re.specialEscapeRegex, '\\$&');
};

re.ignore = function ignore(string, ...subs) {
    if (Array.isArray(string) && string.raw) {
        string = String.raw({ raw: string.raw }, ...subs);
    }

    // A String instance is used here to be able to add a new property on it.
    const str = new String(string); // eslint-disable-line no-new-wrappers
    str[ignored] = true;
    return str;
};

re.specialEscapeRegex = /[|\\{()[^$+*?.-]/g;
re.RegExp = RegExp;

module.exports = re;
