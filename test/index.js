const re = require('..');

function is(r1, r2) {
    return {
        passed: r1.toString() === r2.toString(),
        expected: r2,
        actual: r1
    };
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
        const regex = re.raw`wow${text}`;
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
    },

    multiline() {
        const regex = re.line('g')`
            Hello
            ${' '}${2}
            (
                World
                (?:
                    !|\.
                )*
            ) // Hello world!
        `;

        return is(regex, /Hello 2(World(?:!|\.)*)/g);
    },

    join() {
        const arr = ['1', '2', '?', '\\d', re.ignore`(\d)abc`];
        const joined = re.join(arr);
        const regex = re`--(${joined})`;
        return is(regex, /--(1|2|\?|\\d|(\d)abc)/);
    }
};

for (const key of Object.keys(tests)) {
    const res = tests[key]();
    if (!res.passed) {
        console.error(`Test ${key} failed\nExpected: ${res.expected}\nActual:   ${res.actual}`);
    }
}
