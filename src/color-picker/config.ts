import { Field } from 'payload/types';
import InputField from './InputField';
import Cell from './Cell';

export const validateHexColor = (value: string = ''): true | string => {
  return value.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/) !== null || `Please give a valid hex color`;
}

const colorField: Field = {
  name: 'color',
  type: 'text',
  validate: (value: string) => validateHexColor(value),
  required: true,
  admin: {
    components: {
      Field: InputField,
      Cell,
    }
  }
};

export default colorField;
