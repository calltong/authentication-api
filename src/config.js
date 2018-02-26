import develop from './config/config.develop';
import testing from './config/config.testing';

const env = process.env.NODE_ENV || 'develop';

const setupConfig = (env) => {
  switch (env) {
    case 'testing':
      return testing;
    default:
      return develop;
  }
};

export const config = setupConfig(env);
