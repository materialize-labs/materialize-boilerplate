// String utils
//
// resources:
//  -- mout, https://github.com/mout/mout/tree/master/src/string

const WHITE_SPACES = [
  ' ', '\n', '\r', '\t', '\f', '\v', '\u00A0', '\u1680', '\u180E',
  '\u2000', '\u2001', '\u2002', '\u2003', '\u2004', '\u2005', '\u2006',
  '\u2007', '\u2008', '\u2009', '\u200A', '\u2028', '\u2029', '\u202F',
  '\u205F', '\u3000',
];

/**
 * Repeat string n times
 */
export const repeat = (str, n) => (new Array(n + 1)).join(str);

/**
 * "Safer" String.toLowerCase()
 */
export const lowerCase = str => str.toLowerCase();

/**
 * "Safer" String.toUpperCase()
 */
export const upperCase = str => str.toUpperCase();

/**
 * Remove chars from beginning of string.
 */
export const ltrim = (str, chars) => {
  chars = chars || WHITE_SPACES;

  let start = 0;
  const len = str.length;
  const charLen = chars.length;
  let found = true;
  let i; let
    c;

  while (found && start < len) {
    found = false;
    i = 0;
    c = str.charAt(start);

    while (i < charLen) {
      if (c === chars[i]) {
        found = true;
        start += 1;
        break;
      }
      i += 1;
    }
  }

  return (start >= len) ? '' : str.substr(start, len);
};

/**
 * Remove chars from end of string.
 */
export const rtrim = (str, chars) => {
  chars = chars || WHITE_SPACES;

  let end = str.length - 1;
  const charLen = chars.length;
  let found = true;
  let i; let
    c;

  while (found && end >= 0) {
    found = false;
    i = 0;
    c = str.charAt(end);

    while (i < charLen) {
      i += 1;
      if (c === chars[i]) {
        found = true;
        end -= 1;
        break;
      }
    }
  }

  return (end >= 0) ? str.substring(0, end + 1) : '';
};

/**
 * Remove white-spaces from beginning and end of string.
 */
export const trim = (str, chars) => {
  chars = chars || WHITE_SPACES;
  return ltrim(rtrim(str, chars), chars);
};

/**
 * Remove non-word chars.
 */
export const removeNonWord = str => str.replace(/[^0-9a-zA-Z\xC0-\xFF -]/g, '');

/**
 * Replaces all accented chars with regular ones
 */
export const replaceAccents = (str) => {
  // verifies if the String has accents and replace them
  if (str.search(/[\xC0-\xFF]/g) > -1) {
    str = str
      .replace(/[\xC0-\xC5]/g, 'A')
      .replace(/[\xC6]/g, 'AE')
      .replace(/[\xC7]/g, 'C')
      .replace(/[\xC8-\xCB]/g, 'E')
      .replace(/[\xCC-\xCF]/g, 'I')
      .replace(/[\xD0]/g, 'D')
      .replace(/[\xD1]/g, 'N')
      .replace(/[\xD2-\xD6\xD8]/g, 'O')
      .replace(/[\xD9-\xDC]/g, 'U')
      .replace(/[\xDD]/g, 'Y')
      .replace(/[\xDE]/g, 'P')
      .replace(/[\xE0-\xE5]/g, 'a')
      .replace(/[\xE6]/g, 'ae')
      .replace(/[\xE7]/g, 'c')
      .replace(/[\xE8-\xEB]/g, 'e')
      .replace(/[\xEC-\xEF]/g, 'i')
      .replace(/[\xF1]/g, 'n')
      .replace(/[\xF2-\xF6\xF8]/g, 'o')
      .replace(/[\xF9-\xFC]/g, 'u')
      .replace(/[\xFE]/g, 'p')
      .replace(/[\xFD\xFF]/g, 'y');
  }

  return str;
};

/**
 * Limit number of chars.
 */
export const truncate = (str, maxChars, append, onlyFullWords) => {
  append = append || '...';
  maxChars = onlyFullWords ? maxChars + 1 : maxChars;

  str = trim(str);
  if (str.length <= maxChars) {
    return str;
  }
  str = str.substr(0, maxChars - append.length);
  // crop at last space or remove trailing whitespace
  str = onlyFullWords ? str.substr(0, str.lastIndexOf(' ')) : trim(str);
  return str + append;
};

/**
 * Convert string to camelCase text.
 */
export const camelCase = (str) => {
  str = replaceAccents(str);
  str = removeNonWord(str)
    .replace(/-/g, ' ') // convert all hyphens to spaces
    .replace(/\s[a-z]/g, upperCase) // convert first char of each word to UPPERCASE
    .replace(/\s+/g, '') // remove spaces
    .replace(/^[A-Z]/g, lowerCase); // convert first char to lowercase
  return str;
};

/**
 * Add space between camelCase text.
 */
export const unCamelCase = (str) => {
  str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
  str = str.toLowerCase(); // add space between camelCase text
  return str;
};

/**
 * UPPERCASE first char of each word.
 */
export const properCase = str => lowerCase(str).replace(/^\w|\s\w/g, upperCase);

/**
 * camelCase + UPPERCASE first char
 */
export const pascalCase = str => camelCase(str).replace(/^[a-z]/, upperCase);

export const normalizeLineBreaks = (str, lineEnd) => {
  lineEnd = lineEnd || 'n';

  return str
    .replace(/rn/g, lineEnd) // DOS
    .replace(/r/g, lineEnd) // Mac
    .replace(/n/g, lineEnd); // Unix
};

/**
 * UPPERCASE first char of each sentence and lowercase other chars.
 *
 * Replace first char of each sentence (new line or after '.\s+') to UPPERCASE
 */
export const sentenceCase = str => lowerCase(str).replace(/(^\w)|\.\s+(\w)/gm, upperCase);


/**
 * Replaces hyphens with spaces. (only hyphens between word chars)
 */
export const unhyphenate = str => str.replace(/(\w)(-)(\w)/g, '$1 $3');

/**
 * Convert to lower case, remove accents, remove non-word chars and
 * replace spaces with the specified delimeter.
 * Does not split camelCase text.
 */
export const slugify = (str, delimeter) => {
  if (delimeter == null) {
    delimeter = '-';
  }

  str = replaceAccents(str);
  str = removeNonWord(str);
  str = trim(str) // should come after removeNonWord
    .replace(/ +/g, delimeter) // replace spaces with delimeter
    .toLowerCase();

  return str;
};

/**
 * Replaces spaces with hyphens, split camelCase text, remove non-word chars,
 * remove accents and convert to lower case.
 */
export const hyphenate = (str) => {
  str = unCamelCase(str);
  return slugify(str, '-');
};


/**
 * Replaces spaces with underscores, split camelCase text, remove
 * non-word chars, remove accents and convert to lower case.
 */
export const underscore = (str) => {
  str = unCamelCase(str);
  return slugify(str, '_');
};


/**
 * Searches for a given substring
 */
export const contains = (str, substring, fromIndex) => str.indexOf(substring, fromIndex) !== -1;

/**
 * Truncate string at full words.
 */
export const crop = (str, maxChars, append) => truncate(str, maxChars, append, true);

/**
 * Escapes a string for insertion into HTML.
 */
export const escapeHtml = (str) => {
  str = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;');

  return str;
};

/**
 * Unescapes HTML special chars
 */
export const unescapeHtml = (str) => {
  str = str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
  return str;
};

/**
 * Escape string into unicode sequences
 */
export const escapeUnicode = (str, shouldEscapePrintable) => str.replace(/[\s\S]/g, (ch) => {
  // skip printable ASCII chars if we should not escape them
  if (!shouldEscapePrintable && (/[\x20-\x7E]/).test(ch)) {
    return ch;
  }
  // we use "000" and slice(-4) for brevity, need to pad zeros,
  // unicode escape always have 4 chars after "\u"
  return `\\u${(`000${ch.charCodeAt(0).toString(16)}`).slice(-4)}`;
});

/**
 * Remove HTML tags from string.
 */
export const stripHtmlTags = str => str.replace(/<[^>]*>/g, '');

/**
 * Remove non-printable ASCII chars
 *
 * Matches non-printable ASCII chars -
 * http://en.wikipedia.org/wiki/ASCII#ASCII_printable_characters
 */
export const removeNonASCII = str => str.replace(/[^\x20-\x7E]/g, '');

/**
 * String interpolation
 */
export const interpolate = (template, replacements, syntax) => {
  const stache = /\{\{(\w+)\}\}/g; // mustache-like

  const replaceFn = (match, prop) => (
    (prop in replacements) ? replacements[prop] : ''
  );

  return template.replace(syntax || stache, replaceFn);
};

/**
 * Pad string with `char` if its' length is smaller than `minLen`
 */
export const rpad = (str, minLen, ch) => {
  ch = ch || ' ';
  return (str.length < minLen) ? str + repeat(ch, minLen - str.length) : str;
};

/**
 * Pad string with `char` if its' length is smaller than `minLen`
 */
export const lpad = (str, minLen, ch) => {
  ch = ch || ' ';

  return ((str.length < minLen)
    ? repeat(ch, minLen - str.length) + str : str);
};

/**
 * Capture all capital letters following a word boundary (in case the
 * input is in all caps)
 */
export const abbreviate = str => str.match(/\b([A-Z])/g).join('');
