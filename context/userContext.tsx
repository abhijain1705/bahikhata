import {createContext, Dispatch, SetStateAction} from 'react';
import {UserInterface} from '../common/interface/types';

type UserContextType = {
  user: UserInterface | null;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});
