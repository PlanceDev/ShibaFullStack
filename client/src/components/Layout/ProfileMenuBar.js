import { useWeb3React } from "@web3-react/core";
import { Box, Menu, MenuItem, ListItemIcon, Link } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, resetUserState } from "../../store/User";
import copy from "copy-to-clipboard";

import loginedIcon from "../../assets/images/home/off.png";
import { palette } from "../../themes";
import { useEffect } from "react";

export const ProfileMenuBar = ({
  setProfileMenuOpen,
  profileMenuOpen,
  open,
}) => {
  const { account, activate, deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  const handleDisconnect = () => {
    deactivate();
    dispatch(resetUserState());
  };

  return (
    <Box>
      <Box
        component={"img"}
        alt=""
        src={loginedIcon}
        onClick={(event) => setProfileMenuOpen(event.currentTarget)}
        sx={{
          width: "48px",
          height: "48px",
          cursor: "pointer",
        }}
      />
      <Menu
        anchorEl={profileMenuOpen}
        id="account-menu"
        open={open}
        onClose={() => setProfileMenuOpen(false)}
        onClick={() => setProfileMenuOpen(false)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => copy(currentUser.address)}
          sx={{
            color: palette.common.black,
          }}
        >
          <ListItemIcon>
            <ContentCopyIcon fontSize="small" />
          </ListItemIcon>
          Copy Address
        </MenuItem>
        <MenuItem
          sx={{
            color: palette.common.black,
          }}
        >
          <Link
            target={"_blank"}
            href={`https://sepolia.etherscan.io/address/${currentUser.address}`}
            sx={{
              color: "black",
              fontFamily: "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ListItemIcon>
              <OpenInNewIcon fontSize="small" />
            </ListItemIcon>
            View in Explorer
          </Link>
        </MenuItem>
        <MenuItem
          onClick={handleDisconnect}
          sx={{
            color: palette.common.black,
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Disconnect
        </MenuItem>
      </Menu>
    </Box>
  );
};
