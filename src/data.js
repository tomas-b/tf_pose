import {
  atom,
} from 'recoil';

export const collectedData = atom({
  key: 'collected',
  default: {},
	dangerouslyAllowMutability: true
});