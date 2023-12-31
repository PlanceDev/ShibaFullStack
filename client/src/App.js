import { ThemeProvider, Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactGA from 'react-ga';

import { Web3ReactProvider, useWeb3React, web } from "@web3-react/core";
import { ethers } from "ethers";

import theme from "./themes";

import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { Homepage } from "./pages/Homepage";
import { FAQ } from "./pages/FAQ";
import { Claim } from "./pages/Claim";

import "./App.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as buffer from "buffer";
import { useEffect } from "react";

window.Buffer = buffer.Buffer;

const TRACKING_ID = "UA-289283710-1"; // OUR_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

function App() {
  function getLibrary(provider) {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 8000; // frequency provider is polling
    return library;
  }

  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <Box
      sx={{
        background: "#F7FBFA",
      }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider theme={theme}>
          <AppProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route exact path="/FAQ" element={<FAQ />} />
                  <Route exact path="/claim" element={<Claim />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </AppProvider>
        </ThemeProvider>
      </Web3ReactProvider>

      <ToastContainer position="bottom-left" />
    </Box>
  );
}

export default App;
