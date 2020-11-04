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
  },
  {
    id: 2,
    passwordHash: 'test',
    username: 'test',
    algorithmType: AlgorithmTypeEnum.HMAC,
    saltOrKey: 'test',
  },
  {
    id: 3,
    passwordHash: 'test',
    username: 'test',
    algorithmType: AlgorithmTypeEnum.HMAC,
    saltOrKey: 'test',
  },
];

export const MockUser = {
  id: 1,
  passwordHash: 'test',
  username: 'test',
  algorithmType: AlgorithmTypeEnum.HMAC,
  saltOrKey: 'test',
};
