import { atom } from 'jotai';
import { User } from '../modules/interfaces/user';

const usersDBAtom = atom<User[]>([]);

export { usersDBAtom };
