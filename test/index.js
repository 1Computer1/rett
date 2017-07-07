const re = require('..');
const assert = require('assert');

const tests = {
    basic() {
        const regex = re`^Hello World$`;
        return regex.test('Hello World');
    },
    flags() {
        const regex = re('i')`[a-z]`;
        return regex.test('ABC');
    },
    escape() {
        const text = '?';
        const regex = re`wow${text}`;
        return regex.test('wow?');
    },
    escapeIgnore() {
        const text = '?';
        const regex = re`wow${re.ignore(text)}`;
        return regex.test('wo');
    },
    noEscape() {
        const text = '?';
        const regex = re('', false)`wow${text}`;
        return regex.test('wo');
    },
    building() {
        const g = re('g');
        const digits = re.ignore`\d+`;
        const regex = g`-?${digits}`;
        return regex.test('-123');
    },
    various() {
        const one = '[-)*?{$';
        const two = 'a+b+c+';
        const regex = re('i')`^escaped: ?${one} unescaped: ?${re.ignore(two)}$`;
        return regex.test('ESCAPED:[-)*?{$ UNESCAPED:aaabbbccc');
    }
};

for (const key of Object.keys(tests)) {
    try {
        assert(tests[key](), `Test ${key} failed`);
    } catch (err) {
        console.error(err);
    }
}
