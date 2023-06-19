import React, { useContext, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { palette } from "../../../themes";
import { Context } from "../../../context/AppContext";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

export const Referral = () => {
  const { walletAddress, referralLink, setReferralLink } = useContext(Context);
  const { account, activate } = useWeb3React();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_HOST_URL}/?referral=${referralLink}`
    );
  };

  return (
    <>
      {referralLink && (
        <>
          {walletAddress !== "undefined" && (
            <Box
              p={3}
              mt={6}
              sx={{
                background: `${palette.common.white}`,
                borderRadius: "4px",
                border: `2px solid ${palette.common.brown}`,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  color: `${palette.common.brown} !important`,
                  fontWeight: 700,
                  textAlign: "center",
                  letterSpacing: "2.5px",
                  zIndex: 1000,
                  ":hover": {
                    color: `${palette.common.black} !important`,
                    transition: 0.3,
                  },
                }}
              >
                <span
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={copyToClipboard}
                >
                  COPY REFERRAL LINK
                </span>
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};
