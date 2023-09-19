import React, { useEffect, useState, useCallback, Fragment } from 'react'

// this is how we'll interface with Payload itself
import { useFieldType } from 'payload/components/forms';

// retrieve and store the last used colors of your users
import { usePreferences } from 'payload/components/preferences';

// re-use Payload's built-in button component
import { Button } from 'payload/components';

// we'll re-use the built in Label component directly from Payload
import { Label } from 'payload/components/forms';

import Error from 'payload/dist/admin/components/forms/Error/index';

// we can use existing Payload types easily
import { Props } from 'payload/components/fields/Text';

// we'll import and reuse our existing validator function on the frontend, too
import { validateHexColor } from './config';

// Import the SCSS stylesheet
import './styles.scss';

// keep a list of default colors to choose from
const defaultColors = [
  '#333333',
  '#9A9A9A',
  '#F3F3F3',
  '#FF6F76',
  '#FDFFA4',
  '#B2FFD6',
  '#F3DDF3',
];
const baseClass = 'custom-color-picker';

const preferenceKey = 'color-picker-colors';

const InputField: React.FC<Props> = (props) => {
  const {
    path,
    label,
    required,
    validate,
  } = props;

  const {
    value = "",
    setValue,
    errorMessage,
    showError,
  } = useFieldType({
    path,
    validate,
  });
  const classes = ["field-type", "text", baseClass, showError && "error"]
    .filter(Boolean)
    .join(" ");


  const { getPreference, setPreference } = usePreferences();
  const [colorOptions, setColorOptions] = useState(defaultColors);
  const [isAdding, setIsAdding] = useState(false);
  const [colorToAdd, setColorToAdd] = useState('');

  useEffect(() => {
    const mergeColorsFromPreferences = async () => {
      const colorPreferences = await getPreference<string[]>(preferenceKey);
      if (colorPreferences) {
        setColorOptions(colorPreferences);
      }
    };
    mergeColorsFromPreferences();
  }, [getPreference, setColorOptions]);

  const handleAddColor = useCallback(() => {
    setIsAdding(false);
    setValue(colorToAdd);

    // prevent adding duplicates
    if (colorOptions.indexOf(colorToAdd) > -1) return;

    let newOptions = colorOptions;
    newOptions.unshift(colorToAdd);

    // update state with new colors
    setColorOptions(newOptions);
    // store the user color preferences for future use
    setPreference(preferenceKey, newOptions);
  }, [colorOptions, setPreference, colorToAdd, setIsAdding, setValue]);

  return (
    <div className={classes}>
      <Label
        htmlFor={path}
        label={label}
        required={required}
      />
      <Error showError={showError} message={errorMessage} />
      {isAdding && (
        <div>
          <input
            className={`${baseClass}__input`}
            type="text"
            placeholder="#000000"
            onChange={(e) => setColorToAdd(e.target.value)}
            value={colorToAdd}
          />
          <Button
            className={`${baseClass}__btn`}
            buttonStyle="primary"
            iconPosition="left"
            iconStyle="with-border"
            size="small"
            onClick={handleAddColor}
            disabled={validateHexColor(colorToAdd) !== true}
          >
            Add
          </Button>
          <Button
            className={`${baseClass}__btn`}
            buttonStyle="secondary"
            iconPosition="left"
            iconStyle="with-border"
            size="small"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </Button>
        </div>
      )}
      {!isAdding && (
        <Fragment>
          <ul className={`${baseClass}__colors ${showError ? 'error' : ''}`}>
            {colorOptions.map((color, i) => (
                <li key={i}>
                  <button
                    type="button"
                    key={color}
                    className={`chip ${color === value ? 'chip--selected' : ''} chip--clickable`}
                    style={{ backgroundColor: color }}
                    aria-label={color}
                    onClick={() => setValue(color)}
                  />
                </li>
              )
            )}
          </ul>
          <Button
            className="add-color"
            icon="plus"
            buttonStyle="icon-label"
            iconPosition="left"
            iconStyle="with-border"
            onClick={() => {
              setIsAdding(true);
              setValue('');
            }}
          />
        </Fragment>
      )}
    </div>
  )
};
export default InputField;
