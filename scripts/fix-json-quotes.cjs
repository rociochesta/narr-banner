#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node fix-json-quotes.cjs <file.json>');
  process.exit(1);
}

const raw = fs.readFileSync(path.resolve(filePath), 'utf8');

// Replace curly quotes with straight quotes first
let text = raw
  .replace(/\u201C/g, '"')
  .replace(/\u201D/g, '"');

// Now we need to fix unescaped inner quotes inside JSON strings.
// Strategy: walk the string character by character tracking whether we're
// inside a JSON string or not. When we encounter a " that is NOT preceded
// by \ and we're inside a string, determine if it's a closing quote:
// - closing if next non-space char is one of: : , } ] \n \r
// - closing if it's the structural end of a value
// Otherwise, escape it.

function fixInnerQuotes(str) {
  let result = '';
  let inString = false;
  let i = 0;

  while (i < str.length) {
    const ch = str[i];

    if (!inString) {
      if (ch === '"') {
        inString = true;
        result += ch;
        i++;
        continue;
      }
      result += ch;
      i++;
      continue;
    }

    // We're inside a string
    if (ch === '\\') {
      // Escaped character — pass both chars through
      result += ch;
      i++;
      if (i < str.length) {
        result += str[i];
        i++;
      }
      continue;
    }

    if (ch === '"') {
      // Is this a closing quote?
      // Look ahead past any whitespace (but NOT past newlines for this check)
      let j = i + 1;
      while (j < str.length && str[j] === ' ') j++;
      const next = str[j];

      // Structural closers: : , } ] newline end-of-string
      const isClosing =
        next === ':' ||
        next === ',' ||
        next === '}' ||
        next === ']' ||
        next === '\n' ||
        next === '\r' ||
        j >= str.length;

      if (isClosing) {
        inString = false;
        result += ch;
        i++;
      } else {
        // Inner quote — escape it
        result += '\\"';
        i++;
      }
      continue;
    }

    result += ch;
    i++;
  }

  return result;
}

const fixed = fixInnerQuotes(text);

// Verify it parses
try {
  JSON.parse(fixed);
  console.log('JSON is valid after fix.');
} catch (e) {
  console.error('JSON still invalid after fix:', e.message);
  // Write anyway so we can inspect
}

fs.writeFileSync(path.resolve(filePath), fixed, 'utf8');
console.log('Written:', filePath);
