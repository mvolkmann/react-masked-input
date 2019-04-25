import {func, string} from 'prop-types';
import React from 'react';

const isDigit = char => '0' <= char && char <= '9';
const isLower = char => 'a' <= char && char <= 'z';
const isUpper = char => 'A' <= char && char <= 'Z';
const isLetter = char => isLower(char) || isUpper(char);

function MaskedInput({mask, onChange, placeholder, value}) {
  console.log('masked-input.js x: mask =', mask);

  function handleChange(event) {
    //const {value} = event.target;
    //if (re.test(value)) onChange(event);
    onChange(event);
  }

  function onKeyDown(event) {
    const {key} = event;

    //TODO: Handle when cursor is not at end.
    const position = value.length;

    const maskChar = mask[position];

    const allow =
      value.length >= mask.length
        ? false
        : maskChar === 'd'
        ? isDigit(key)
        : maskChar === 'L'
        ? isLetter(key)
        : maskChar === 'l'
        ? isLower(key)
        : maskChar === 'u'
        ? isUpper(key)
        : key === maskChar;

    if (!allow) event.preventDefault();
  }

  return (
    <input
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
