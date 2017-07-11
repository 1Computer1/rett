# rett

*Regular Expressions Template Tag*  

## Features

- Removes need to use double backslash.
- Escapes special regex characters.
- Choosing when to escape special characters.
- Multiline regex with comments and indents.
- Utility for making complex regex.  

## Usage

### Basic Use

The `re` function can either take a template tag or be called normally.  
When called normally, it takes regex flags and can only take a template tag from then on.  

```js
const re = require('rett');

console.log(re`\d+\b`);
// => /\d+\b/

console.log(re('gi')`\b[a-z]\b`);
// => /\b[a-z]\b/gi
```

### Substitutions

Interpolate values just like any other template string.  
All values will automatically be escaped.  

```js
const text = '?+{[()';

console.log(re`${text} \d+`);
// => /\?\+\{\[\(\) \d+/
```

### Multiline Regex

The `re.line` function is used for multiline regex.  
It has support for indents as well as single-line comments.  
It works in the same way as the `re` function.  

```js
console.log(re.line`
    (
        \d+     // Digits
        [A-Z]   // Letter
    )
`);

// => /(\d+[A-Z])/
```

### Ignoring Escape

Ignore escapes if you are planning on building regex bit by bit.  
This is done with the `re.ignore` function which can take either a string or a template tag.  
The `re.raw` function is also available for disabling escaping altogether.  

```js
const special = '{0,2}';

console.log(re`1${re.ignore(special)}`);
// => /1{0,2}/

console.log(re.raw`1${special}`);
// => /1{0,2}/

const digits = re.ignore`\d+`;

console.log(re`-?${digits}`);
// => /-?\d+/
```

## Utility

### `re.escape()`

Escapes special regex characters from a string.  
Can take a template tag and will escape interpolated values.  

```js
console.log(re.escape('What?'));
// => 'What\\?'
```

### `re.unescape()`

Unescapes special regex characters from a string.  
Can take a template tag and will unescape interpolated values.  
Note that this is not a perfect reversal.  

```js
console.log(re.unescape('What\\?'));
// => 'What?'
```

### `re.join()`

Joins an array together by a character.  
Escapes the values of the array.  
Useful for making different possibilties with `|` in regex.  

```js
const list = re.join(['(', ')', '?']);
const regex = re`${list}`;

console.log(regex);
// => /\(|\)|\?/
```

## Options

### `re.options`

You can set the default options here.  

- `escape`: default for escaping substitutions.
- `multiline`: default for parsing as multiline.
- `debug`: logs to console whenever a regex is made.
- `flags.default`: default for flags if no flags provided.
- `flags.addtion`: flags to add onto exisiting flags.

```js
re.options = {
    escape: true,
    multiline: true,
    debug: true,
    flags: {
        default: 'u',
        addition: 'u'
    }
};

console.log(re`
    ABC  // Matches A, B, then C.
    (\d) // Then a number.
`);

// => /ABC(\d)/u
```

### `re.specialEscapeRegex`

Regex for escaping special characters.  
Reassign with your own if needed.  

### `re.RegExp`

Constructor used for creating new regular expression instances.  
Reassign with your own if needed.  

## Other

### `re.create()`

Creates a new regex from the values inputted.  
Used internally.  

```js
console.log(re.create(['a', 'b'], [1], { flags: 'g' }));
// => /a1b/g
```

### `re.isTemplateTag()`

Checks if a value is a template tag.  
Used internally.  

```js
console.log(re.isTemplateTag`asdf`);
// => true
```
