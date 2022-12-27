import { validate } from 'class-validator';

export const validationOptions: Parameters<typeof validate>[1] = {
  whitelist: true,
  transform: true,
  validationError: {
    target: false,
  },
};
