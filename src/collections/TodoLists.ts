import { CollectionConfig } from 'payload/types';
import colorField from "../color-picker/config";

const Todo: CollectionConfig = {
  slug: 'todos',
  admin: {
    defaultColumns: ['listName', 'tasks', 'updatedAt'],
    useAsTitle: 'listName',
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'listName',
      type: 'text',
    },
    colorField,
    {
      name: 'tasks',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'complete',
          type: 'checkbox',
          defaultValue: false,
        },
      ]
    },
  ],
}

export default Todo;
