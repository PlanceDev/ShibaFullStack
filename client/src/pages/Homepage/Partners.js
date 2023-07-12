import { Box, Typography } from "@mui/material";
import Ticker from "react-ticker";

import { CustomButton } from "../../components/CustomButton";
import pinksaleLogo from "../../assets/images/partners/1.png";
import dexviewLogo from "../../assets/images/partners/2.png";

export const Partners = () => {
  const handleNavigate = (link) => {
    window.open(link, "_blank");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F1F4F4",
        padding: "50px 0",
      }}
    >
      <Typography
        sx={{
          color: "#3c2c2d",
          fontSize: { md: 72, sm: 56, xs: 48 },
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Partners
      </Typography>

      <Box
        onClick={() => handleNavigate("https://pinksale.finance/")}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "center",
          gap: "50px",
          width: "100%",
          height: "100%",
          borderBottom: "1px solid #3c2c2d",
          padding: "50px 0",

          "& img": {
            width: "50px",
            minHeight: "50px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "250px",
            border: "1px solid #3c2c2d",
            borderRadius: "3px",
            gap: "10px",
            color: "#3c2c2d",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <img src={pinksaleLogo} alt="pinksale" />
          <Typography>PinkSale</Typography>
        </Box>

        <Box
          onClick={() => handleNavigate("https://dexview.com/")}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "250px",
            border: "1px solid #3c2c2d",
            borderRadius: "3px",
            gap: "10px",
            color: "#3c2c2d",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <img src={dexviewLogo} alt="dexview" />
          <Typography>DexView</Typography>
        </Box>
      </Box>
    </Box>
  );
};
