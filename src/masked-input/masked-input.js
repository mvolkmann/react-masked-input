import {func, string} from 'prop-types';
import React from 'react';
import './masked-input.css';

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

function MaskedInput({mask, onChange, placeholder, value}) {
  function handleChange(event) {
    onChange(event);
  }

  //TODO: Handle when cursor is not at end.
  function onKeyDown(event) {
    const {key, target} = event;
    let position = target.selectionEnd;

    if (isSpecialKey(key)) return;

    const maskChar = mask[value.length];
    if (isLiteral(maskChar) && key === maskChar) return;

    event.preventDefault();

    if (value.length >= mask.length) return;

    let literals = '';

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

    let newValue =
      value.substring(0, position) + literals + key + value.substring(position);

    const atEnd = position === target.value.length;
    if (!atEnd) {
      // Reflow the placeholder values.

      // Get all the non-placeholder characters from the mask.
      const literalSet = new Set();
      for (const char of mask) {
        if (!isPlaceholder(char)) literalSet.add(char);
      }
      console.log('masked-input.js x: literalSet =', literalSet);

      // Remove non-placeholder characters from the value.
      let rawValue = '';
      for (const char of newValue) {
        if (!literalSet.has(char)) rawValue += char;
      }
      console.log('masked-input.js x: rawValue =', rawValue);

      let reflowedValue = '';
      for (const char of mask) {
        if (rawValue.length === 0) break; // no more characters to reflow

        if (isPlaceholder(char)) {
          reflowedValue += rawValue[0];
          rawValue = rawValue.substring(1);
        } else {
          reflowedValue += char;
        }
      }
      console.log('masked-input.js x: reflowedValue =', reflowedValue);

      newValue = reflowedValue;
    }

    target.value = newValue;

    handleChange(event);

    position += literals.length + 1;
    setTimeout(() => target.setSelectionRange(position, position), 0);
  }

  return (
    <input
      className="masked-input"
      type="text"
      onChange={handleChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      value={value}
    />
  );
}

MaskedInput.propTypes = {
  mask: string.isRequired,
  placeholder: string,
  onChange: func.isRequired,
  value: string.isRequired
};
MaskedInput.defaultProps = {
  placeholder: ''
};

export default MaskedInput;
