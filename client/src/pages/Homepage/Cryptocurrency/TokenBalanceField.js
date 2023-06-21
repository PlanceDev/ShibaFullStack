import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { palette } from "../../../themes";
import { useSelector, useDispatch } from "react-redux";

const valueTypes = [
  { name: "Balance" },
  { name: "Current Price" },
  { name: "Next Price" },
  { name: "Your Points" },
];

export const TokenBalanceField = ({
  points,
  tokenBalance,
  currentPrice,
  nextPrice,
  walletAddress,
}) => {
  const currentUser = useSelector((state) => state.user);
  const currentChain = useSelector((state) => state.chain);

  // useEffect(() => {
  //   console.log("currentUser", currentUser);
  //   console.log("currentChain", currentChain);
  // }, [currentChain]);

  return (
    <Box
      display={"flex"}
      flexWrap={"wrap"}
      justifyContent={"space-between"}
      alignItems={"center"}
      px={6}
      py={4}
      mt={6}
      sx={{
        background: palette.common.white,
        borderRadius: "4px",
      }}
    >
      {valueTypes.map((item, i) => (
        <Box
          key={i}
          my={{ sm: 0, xs: 1 }}
          sx={{
            width: { sm: "initial", xs: "50%" },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: "#686A6C !important",
            }}
          >
            {" "}
            {item.name}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              // display: "flex",
              // justifyContent: "center",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {i === 0
              ? walletAddress === "undefined"
                ? "-"
                : Number(currentUser.balance).toFixed(7)
              : i === 1
              ? `$ ${Number(currentChain.currentPrice / 10000).toFixed(7)}`
              : i === 2
              ? `$ ${Number(currentChain.nextPrice / 10000).toFixed(7)}`
              : i === 3 && walletAddress === "undefined"
              ? "-"
              : currentUser.points}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
