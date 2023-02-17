import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import fs from 'fs';
import { validationOptions } from '../../shared/constants/validation-options';
import { EnvModel } from '../models/env.model';

export function getEnvPath(): string | undefined {
  const nodeEnv = process.env.NODE_ENV;
  const queue = [
    `.env.${nodeEnv}`,
    `.env.${nodeEnv}.local`,
    '.env.local',
    '.env',
  ];
  return queue.find((path) => fs.existsSync(path));
}

export function validateEnv(config: Record<string, unknown>) {
  const env = plainToInstance(EnvModel, config);

  const errors = validateSync(env, validationOptions);
  if (errors.length) {
    throw errors;
  }

  return env;
}
