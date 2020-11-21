import { AlgorithmTypeEnum } from 'src/database/constants/algorithmType.const';

export const MockPassword = {
  id: 1,
  password: 'test',
  user: 1,
  webAddress: 'test',
  description: 'test',
  login: 'test',
};

export const MockPasswords = [
  {
    id: 1,
    password: 'test',
    user: 1,
    webAddress: 'test',
    description: 'test',
    login: 'test',
  },
  {
    id: 2,
    password: 'test',
    user: 1,
    webAddress: 'test',
    description: 'test',
    login: 'test',
  },
  {
    id: 3,
    password: 'test',
    user: 1,
    webAddress: 'test',
    description: 'test',
    login: 'test',
  },
  {
    id: 4,
    password: 'test',
    user: 1,
    webAddress: 'test',
    description: 'test',
    login: 'test',
  },
];

export const MockUsers = [
  {
    id: 1,
    passwordHash: 'test',
    username: 'test',
    algorithmType: AlgorithmTypeEnum.HMAC,
    saltOrKey: 'test',
    blockDate: null,
    isBlocked: false,
    numberOfWrongLogins: null,
  },
  {
    id: 2,
    passwordHash: 'test',
    username: 'test',
    algorithmType: AlgorithmTypeEnum.HMAC,
    saltOrKey: 'test',
    blockDate: null,
    isBlocked: false,
    numberOfWrongLogins: null,
  },
  {
    id: 3,
    passwordHash: 'test',
    username: 'test',
    algorithmType: AlgorithmTypeEnum.HMAC,
    saltOrKey: 'test',
    blockDate: null,
    isBlocked: false,
    numberOfWrongLogins: null,
  },
];

export const MockUser = {
  id: 1,
  passwordHash:
    '9ba1f63365a6caf66e46348f43cdef956015bea997adeb06e69007ee3ff517df10fc5eb860da3d43b82c2a040c931119d2dfc6d08e253742293a868cc2d82015',
  username: 'test',
  algorithmType: AlgorithmTypeEnum.HMAC,
  saltOrKey: 'test',
  blockDate: null,
  isBlocked: false,
  numberOfWrongLogins: null,
};
