# react-masked-input

This is a text input component that supports a mask.
The mask uses the following placeholder characters to indicate
what users can enter at a certain position in the input.

- d means digit (0-9)
- l means lowercase letter (a-z)
- u means uppercase letter (A-Z)
- L means letter, either lowercase or uppercase

All other characters are taken as literals.

For example, to restrict input to be a U.S. phone number
where the area code is surrounded by parentheses,
followed by a space, 3 digits, a dash, and 4 more digits,
use the following:

```html
<MaskedInput
  mask="(ddd) ddd-dddd"
  onChange="{onChange}"
  placeholder="(999) 999-9999"
  value="{phone}"
/>
```

When the input loses focus, if its value does not match the mask
it will have a red border.

This supports inserting text into the middle of the current value
by moving the cursor before typing more characters.
It also supports selecting characters and typing over them to replace them.

It does not currently support pasting characters from the clipboard.

When inserting characters at a location other than the end,
it may push previously entered characters into
invalid positions according to the mask.

To run the demo:

- `npm install`
- `npm run start`
