import { useState, createContext } from "react";

const Context = createContext();

const AppProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const [contract, setContract] = useState(null);
  const [currentChainId, setCurrentChainId] = useState("0xaa36a7");
  const [tokenContract, setTokenContract] = useState(null);
  const [points, setPoints] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [nextPrice, setNextPrice] = useState(0);
  const [timerValue, setTimerValue] = useState(0);
  const [cryptoType, setCryptoType] = useState("s_Raiser");
  const [raiseValue, setRaiseValue] = useState(0);
  const [chainStatus, setChainStatus] = useState(false);
  const [clickStatus, setClickStatus] = useState(false);
  const [referralCode, setReferralCode] = useState("system");
  const [referralLink, setReferralLink] = useState(
    localStorage.getItem("referralLink") || "undefined"
  );
  const [pricingRounds, setPricingRounds] = useState(0);

  return (
    <Context.Provider
      value={{
        openModal,
        setOpenModal,
        contract,
        setContract,
        currentChainId,
        setCurrentChainId,
        tokenContract,
        setTokenContract,
        points,
        setPoints,
        tokenBalance,
        setTokenBalance,
        currentPrice,
        setCurrentPrice,
        nextPrice,
        setNextPrice,
        timerValue,
        setTimerValue,
        cryptoType,
        setCryptoType,
        raiseValue,
        setRaiseValue,
        chainStatus,
        setChainStatus,
        clickStatus,
        setClickStatus,
        referralCode,
        setReferralCode,
        referralLink,
        setReferralLink,
        pricingRounds,
        setPricingRounds,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { AppProvider, Context };
