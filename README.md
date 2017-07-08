# rett

*Regular Expressions Template Tag*  

## Features

- Removes need to use double backslash.
- Escapes special regex characters.
- Choosing when to escape special characters.

## Usage

### Basic Use

The `re` function can either take a template tag or be called normally.  
When called normally, it takes regex flags and can only take a template tag from then on.  

```js
const re = require('rett');

console.log(re`\d+\b`);
=> /\d+\b/

console.log(re('gi')`\b[a-z]\b`);
=> /\b[a-z]\b/gi
```

### Substitutions

Interpolate values just like any other template string.  
All values will automatically be escaped.  

```js
const text = '?+{[()';

console.log(re`${text} \d+`);
=> /\?\+\{\[\(\) \d+/
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
=> /(\d+[A-Z])/
```

### Ignoring Escape

Ignore escapes if you are planning on building regex bit by bit.  
This is done with the `re.ignore` function which can take either a string or a template tag.  
The `re.raw` function is also available for disabling escaping altogether.  

```js
const special = '{0,2}';

console.log(re`1${re.ignore(special)}`);
=> /1{0,2}/

console.log(re.raw`1${special}`);
=> /1{0,2}/

const digits = re.ignore`\d+`;

console.log(re`-?${digits}`);
=> /-?\d+/
```

## Other

### `re.create()`

Creates a new regex from the values inputted.  
Used internally.  

### `re.escape()`

Escapes special regex characters from a string.  

### `re.isTemplateTag()`

Checks if a value is a template tag.  

### `re.specialEscapeRegex`

Regex for escaping special characters.  
Reassign with your own if needed.  

### `re.RegExp`

Constructor used for creating new regular expression instances.  
Reassign with your own if needed.  
