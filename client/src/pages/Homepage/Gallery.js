import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  LinearProgress,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import axios from "axios";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { CustomButton } from "../../components/CustomButton";

import image1 from "../../assets/images/home/image 1.png";
import image2 from "../../assets/images/home/image 2.png";
import image3 from "../../assets/images/home/image 3.png";
import image4 from "../../assets/images/home/image 4.png";
import image5 from "../../assets/images/home/image 5.png";
import image6 from "../../assets/images/home/image 6.png";
import image7 from "../../assets/images/home/image 7.png";
import image8 from "../../assets/images/home/image 8.png";
import image9 from "../../assets/images/home/image 9.png";
import image10 from "../../assets/images/home/image 10.png";
import image11 from "../../assets/images/home/image 11.png";
import image12 from "../../assets/images/home/image 12.png";
import image13 from "../../assets/images/home/image 13.png";
import image14 from "../../assets/images/home/image 14.png";
import image15 from "../../assets/images/home/image 15.png";
import {
  SDmodelMappingDiffuser,
  sdModelsDiffusers,
} from "../../constant/models";

const styles = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const galleries = [
  { image: image1 },
  { image: image2 },
  { image: image3 },
  { image: image4 },
  { image: image5 },
  { image: image6 },
  { image: image7 },
  { image: image8 },
  { image: image9 },
  { image: image10 },
  { image: image14 },
  { image: image15 },
  { image: image11 },
  { image: image12 },
  { image: image13 },
];

export const Gallery = () => {
  const modelTypes = ["Real", "Anime", "Dream", "Fantasy"];
  const matches = useMediaQuery("(min-width:426px)");
  const [showGalleries, setShowGalleries] = useState([]);
  const [modelType, setModelType] = useState("Real");
  const [showMoreCount, SetShowMoreCount] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/image`, {
        withCredentials: true,
      });

      setShowGalleries(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchImages();
  }, []);

  // useEffect(() => {
  //   const showItems = galleries.slice(0, 12);
  //   setShowGalleries(showItems);
  //   SetShowMoreCount(galleries.length - 12);
  // }, []);

  const handleMoreClick = () => {
    // setShowGalleries(galleries);
    SetShowMoreCount(0);
  };

  const onGenerate = async () => {
    setIsFetching(true);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/image`,
        {
          prompt: prompt,
          modelType: modelType,
        },
        {
          "Content-Type": "application/json",
        },
        { withCredentials: true },
      );

      setShowGalleries((prev) => [res.data, ...prev]);
    } catch (err) {
      console.log(err);
    }

    setIsFetching(false);
  };

  return (
    <Box
      py={{ md: 20, xs: 10 }}
      px={{ md: 20, sm: 10, xs: 4 }}
      sx={{
        maxWidth: "1440px",
        margin: "auto",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { md: 72, sm: 56, xs: 48 },
          lineHeight: { sm: "96px", xs: "48px" },
        }}
      >
        Gallery.
      </Typography>
      <Typography
        variant="h3"
        mt={3}
        mb={{ sm: 0, xs: 8 }}
        sx={{
          display: { sm: "none", xs: "block" },
          fontSize: { md: 24, sm: 20, xs: 18 },
          lineHeight: { sm: "32px", xs: "24px" },
          color: "#686A6C !important",
        }}
      >
        Shiba art you'll love
      </Typography>
      <input
        type="search"
        placeholder="Shiba inu wearing sunglasses"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{
          display: matches ? "none" : "block",
          border: "2px solid #A6AEAD",
          borderRadius: "4px",
          width: "100%",
          color: "#686A6C",
          fontFamily: "Inter",
          fontWeight: 600,
          fontSize: 14,
          lineHeight: "24px",
          padding: "10px 24px",
        }}
      />
      <Box
        mt={{ sm: 8, xs: 4 }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={2}
      >
        <input
          type="search"
          placeholder="Shiba inu wearing sunglasses"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            display: matches ? "block" : "none",
            border: "2px solid #A6AEAD",
            borderRadius: "4px",
            width: "100%",
            color: "#686A6C",
            fontFamily: "Inter",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "24px",
            padding: "10px 24px",
          }}
        />
        <CustomButton
          title="GENERATE"
          styles={matches ? "inital" : styles}
          handleClick={onGenerate}
        />

        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          sx={{
            border: "2px solid #686A6C",
            borderRadius: "4px",
            width: "44px",
            height: "44px",
            flexShrink: 0,
          }}
        >
          <SettingsOutlinedIcon
            sx={{
              color: "#525252",
              fontSize: 30,
            }}
          />
        </Box>
      </Box>
      <Box
        display={{ sm: "flex", xs: "flex" }}
        justifyContent={"center"}
        alignItems={"center"}
        flexWrap={"wrap"}
        gap={4}
        marginTop={4}
      >
        {modelTypes.map((mt, i) => (
          <Button
            key={i}
            onClick={() => setModelType(mt)}
            sx={{
              width: "110px",
              border: "2px solid #3C2C2D",
              borderRadius: "4px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              background: modelType === mt ? "#f6e1ce" : "#fff",
              "&:hover": {
                background: "#f6e1ce",
              },
            }}
          >
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "#8C7662",
                }}
              >
                {mt}
              </Typography>
            </Box>
          </Button>
        ))}
      </Box>
      <Box mt="10px">{(isLoading || isFetching) && <LinearProgress />}</Box>
      <Box mt={12}>
        <Grid container spacing={{ sm: 8, xs: 4 }}>
          {showGalleries.map((item, i) => (
            <Grid key={i} item md={3} sm={6} xs={12}>
              <Box
                component={"img"}
                src={`data:image/png;base64,${item.imageData}`}
                alt=""
                sx={{
                  width: "100%",
                }}
              />
            </Grid>
          ))}
        </Grid>
        {/* <Box display={"flex"} justifyContent={"center"} mt={{ sm: 12, xs: 6 }}>
          <CustomButton
            title="SEE MORE"
            showMore={showMoreCount}
            handleClick={handleMoreClick}
          />
        </Box> */}
      </Box>
    </Box>
  );
};
