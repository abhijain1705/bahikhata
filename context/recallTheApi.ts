import {createContext, useContext} from 'react';

interface ApiCallContextType {
  apiIsCalled: boolean;
  setApiIsCalled: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ContextApiCallProvider = createContext<ApiCallContextType>({
  apiIsCalled: false,
  setApiIsCalled: () => {},
});

export const UseApiCallContext = () => useContext(ContextApiCallProvider);

interface SingleLedgerApiCallContextType {
  singleLedgerApiCalling: boolean;
  setsingleLedgerApiCalling: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ContextSingleLedgerAPiCallProvider =
  createContext<SingleLedgerApiCallContextType>({
    singleLedgerApiCalling: false,
    setsingleLedgerApiCalling: () => {},
  });

export const UseSingleLedgerApiCallContext = () =>
  useContext(ContextSingleLedgerAPiCallProvider);
