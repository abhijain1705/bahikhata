import React, {createContext, ReactNode, Dispatch, SetStateAction} from "react";
import {UserInterface} from "./common/interface/types";

type UserContextType = {
  user: UserInterface | null;
  setUser: Dispatch<SetStateAction<UserInterface | null>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

type UserProviderProps = {
  children: ReactNode;
  user: UserInterface | null;
  setUser: () => {};
};

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  user,
  setUser,
}) => {
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
