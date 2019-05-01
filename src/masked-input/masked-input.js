import {func, string} from 'prop-types';
import React from 'react';
import './masked-input.css';

const needsEscape = '[^$.|?*+(){}()';

function getRegExp(mask) {
  let regExp = '';
  for (const char of mask) {
    regExp += needsEscape.includes(char)
      ? '\\' + char
      : char === 'd'
      ? '\\d'
      : char === 'L'
      ? '[A-Za-z]'
      : char === 'l'
      ? '[a-z]'
      : char === 'u'
      ? '[A-Z]'
      : char;
  }
  return regExp;
}

const isDigit = char => '0' <= char && char <= '9';
const isLower = char => 'a' <= char && char <= 'z';
const isUpper = char => 'A' <= char && char <= 'Z';
const isLetter = char => isLower(char) || isUpper(char);

const isPlaceholder = char => ['d', 'L', 'l', 'u'].includes(char);
const isLiteral = char => !isPlaceholder(char);

const isSpecialKey = key =>
  key === 'Alt' ||
  key === 'Backspace' ||
  key === 'Control' ||
  key === 'Escape' ||
  key === 'Meta' ||
  key === 'Shift' ||
  key === 'Tab' ||
  key.startsWith('Arrow');

function keyMatchesPlaceholder(maskChar, key) {
  return maskChar === 'd'
    ? isDigit(key)
    : maskChar === 'L'
    ? isLetter(key)
    : maskChar === 'l'
    ? isLower(key)
    : maskChar === 'u'
    ? isUpper(key)
    : false;
}

function MaskedInput({mask, onChange, onMaskedChange, placeholder, value}) {
  function handleChange(event, maskedValue) {
    onChange(event);
    onMaskedChange(maskedValue);
  }

  function onKeyDown(event) {
    const {key, target} = event;
    //console.log('masked-input.js onKeyDown: key =', key);

    if (isSpecialKey(key)) return;

    const maskChar = mask[value.length];
    if (isLiteral(maskChar) && key === maskChar) return;

    event.preventDefault();

    let {selectionEnd, selectionStart} = target;
    const textSelected = selectionEnd > selectionStart;

    if (value.length >= mask.length && !textSelected) return;

    let literals = '';

    if (textSelected) {
      // Delete selected characters.
      value =
        value.substring(0, selectionStart) + value.substring(selectionEnd);

      selectionEnd = selectionStart;
    } else {
      if (!keyMatchesPlaceholder(maskChar, key)) {
        // Find the next placeholder character.
        const len = value.length;
        const remainingMask = mask.substring(len);

        let placeholder;
        for (const char of remainingMask) {
          if (isPlaceholder(char)) {
            placeholder = char;
            break;
          }
        }

        // Don't allow key if no matching mask placeholder was found.
        if (!placeholder || !keyMatchesPlaceholder(placeholder, key)) return;

        // Add all the literal characters up to the placeholder to the value.
        for (const char of remainingMask) {
          if (!isLiteral(char)) break;
          literals += char;
        }
      }
    }

    let position = selectionEnd;

    let newValue =
      value.substring(0, position) + literals + key + value.substring(position);

    // Get all the non-placeholder characters from the mask.
    const literalSet = new Set();
    for (const char of mask) {
      if (!isPlaceholder(char)) literalSet.add(char);
    }

    // Get the characters in the new value that are not mask literals.
    let maskedValue = '';
    for (const char of newValue) {
      if (!literalSet.has(char)) maskedValue += char;
    }

    const atEnd = position === target.value.length;
    if (!atEnd) {
      // Reflow the placeholder values.
      let reflowedValue = '';
      let maskedCopy = maskedValue;
      for (const char of mask) {
        if (maskedCopy.length === 0) break; // no more characters to reflow

        if (isPlaceholder(char)) {
          reflowedValue += maskedCopy[0];
          maskedCopy = maskedCopy.substring(1);
        } else {
          reflowedValue += char;
        }
      }

      newValue = reflowedValue;
    }

    target.value = newValue;

    handleChange(event, maskedValue);

    position += literals.length + 1;
    setTimeout(() => target.setSelectionRange(position, position), 0);
  }

  return (
    <input
      className="masked-input"
      type="text"
      onChange={handleChange}
      onKeyDown={onKeyDown}
      pattern={getRegExp(mask)}
      placeholder={placeholder}
      value={value}
    />
  );
}

MaskedInput.propTypes = {
  mask: string.isRequired,
  placeholder: string,
  onChange: func.isRequired,
  onMaskedChange: func.isRequired,
  value: string.isRequired
};
MaskedInput.defaultProps = {
  placeholder: ''
};

export default MaskedInput;
