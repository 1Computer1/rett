const re = require('..');
const assert = require('assert');

function is(r1, r2) {
    return r1.toString() === r2.toString();
}

const tests = {
    basic() {
        const regex = re`^Hello World$`;
        return is(regex, /^Hello World$/);
    },
    flags() {
        const regex = re('i')`[a-z]`;
        return is(regex, /[a-z]/i);
    },
    escape() {
        const text = '?';
        const regex = re`wow${text}`;
        return is(regex, /wow\?/);
    },
    escapeIgnore() {
        const text = '?';
        const regex = re`wow${re.ignore(text)}`;
        return is(regex, /wow?/);
    },
    noEscape() {
        const text = '?';
        const regex = re('', false)`wow${text}`;
        return is(regex, /wow?/);
    },
    building() {
        const g = re('g');
        const digits = re.ignore`\d+`;
        const regex = g`-?${digits}`;
        return is(regex, /-?\d+/g);
    },
    various() {
        const one = '[)*?{$';
        const two = 'a+b+c+';
        const regex = re('i')`^${one} ?${re.ignore(two)}$`;
        return is(regex, /^\[\)\*\?\{\$ ?a+b+c+$/i);
    }
};

for (const key of Object.keys(tests)) {
    try {
        assert(tests[key](), `Test ${key} failed`);
    } catch (err) {
        console.error(err);
    }
}
