import React from "react";
import { useEffect, useContext, useState } from "react";
import { Box, Typography } from "@mui/material";
import { palette } from "../../../themes";
import { Context } from "../../../context/AppContext";

const durations = [
  { value: 4, time: "days" },
  { value: 12, time: "hours" },
  { value: 15, time: "mins" },
  { value: 34, time: "seconds" },
];

export const DurationField = ({ timerValue }) => {
  const { pricingRounds, setPricingRounds } = useContext(Context);

  return (
    <Box mt={6}>
      <Typography
        variant="h3"
        sx={{
          fontSize: 16,
          color: "#714c29 !important",
          textAlign: "center",
          // backgroundColor: "#fff",
          border: "1px solid #714c29",
          borderRadius: "3px",
        }}
      >
        {pricingRounds < 1 && "Sale Begins In"}
        {pricingRounds >= 1 &&
          pricingRounds <= 30 &&
          `Time Until Price Increase (${pricingRounds}  / 30)`}
        {pricingRounds > 30 && "Sale Not Active"}
      </Typography>

      <Box
        mt={6}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {durations.map((item, i) => (
          <Box
            key={i}
            p={2}
            mx={1}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              width: { sm: "158px", xs: "140px" },
              height: "96px",
              background: "#3C2C2D",
              borderRadius: "4px",
            }}
          >
            <Typography
              sx={{
                fontSize: { sm: 48, xs: 36 },
                fontWeight: 700,
                lineHeight: 1,
                color: palette.common.white,
              }}
            >
              {i === 0
                ? parseInt(timerValue.days || 0)
                : i === 1
                ? parseInt(timerValue.hours || 0)
                : i === 2
                ? parseInt(timerValue.minutes || 0)
                : parseInt(timerValue.seconds || 0)}
            </Typography>

            <Typography
              sx={{
                fontSize: 16,
                color: "#F8CAA0",
              }}
            >
              {item.time}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
