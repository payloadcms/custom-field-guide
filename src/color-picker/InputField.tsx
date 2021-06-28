import React, { useEffect, useState } from 'react'
import { Button } from "payload/components";
import { useFieldType } from 'payload/components/forms';
import Label from "payload/dist/admin/components/forms/Label";
import { Props } from 'payload/dist/admin/components/forms/field-types/Text/types';
import { usePreferences } from "payload/dist/admin/components/utilities/Preferences";
import { validateHexColor } from './config';

import './styles.scss';

// keep a list of out of the box colors to choose from
const defaultColors = [
  '#333333',
  '#9A9A9A',
  '#F3F3F3',
  '#FF6F76',
  '#FDFFA4',
  '#B2FFD6',
  '#F3DDF3',
];

const InputField: React.FC<Props> = (props) => {
  const {
    path,
    label,
    required
  } = props;

  const {
    value = '',
    setValue,
  } = useFieldType({ path });
  const { getPreference, setPreference } = usePreferences();

  const [colorOptions, setColorOptions] = useState(defaultColors);
  const [isAdding, setIsAdding] = useState(false);
  const [colorToAdd, setColorToAdd] = useState('');
  const preferenceKey = 'color-picker.colors';

  // handle incoming value that is not currently an option
  useEffect(() => {
    if (value && colorOptions.indexOf(value) === -1) {
      setColorOptions([value, ...colorOptions])
    }
  }, [value, colorOptions, setColorOptions])

  useEffect(() => {
    const mergeColorsFromPreferences = async () => {
      const colorPreferences = await getPreference<string[]>(preferenceKey);
      if (colorPreferences) {
        setColorOptions(colorPreferences);
      }
    };

    mergeColorsFromPreferences();
  }, [getPreference, setColorOptions]);

  const handleAddColor = () => {
    if (validateHexColor(colorToAdd) !== true) return;
    setIsAdding(false);
    setValue(colorToAdd);

    // prevent adding duplicates
    if (colorOptions.indexOf(colorToAdd) > -1) return;

    let newOptions = colorOptions;
    newOptions.unshift(colorToAdd);
    setColorOptions(newOptions);
    // store the user color preferences for future use
    setPreference(preferenceKey, newOptions);
  };

  return (
    <React.Fragment>
      <Label
        htmlFor={path}
        label={label}
        required={required}
      />
      {isAdding && (
        <div>
          <input
            className="input"
            type="text"
            placeholder="#000000"
            onChange={(e) => setColorToAdd(e.target.value)}
            value={colorToAdd}
          />
          <Button
            buttonStyle="primary"
            iconPosition="left"
            iconStyle="with-border"
            size="small"
            onClick={handleAddColor}
            disabled={validateHexColor(value) !== true}
          >
            Add
          </Button>
          <Button
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
        <div>
          {colorOptions.map((color, i) =>
            <div key={color} className={`chip ${color === value ? 'chip__selected' : ''} chip__clickable`}
                 style={{ backgroundColor: color }}
                 aria-label={color}
                 onClick={() => setValue(color)}>
            </div>
          )}
          {!isAdding &&
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
          }
        </div>
      )}
    </React.Fragment>
  )
};

export default InputField;
