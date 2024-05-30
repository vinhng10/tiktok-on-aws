import {
  Favorite,
  AddCircle,
  KeyboardArrowUp,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardCover,
  IconButton,
} from "@mui/joy";
import { useState } from "react";

const Home = () => {
  const videos = [
    "https://videos.pexels.com/video-files/4053047/4053047-hd_1280_720_50fps.mp4",
    "https://videos.pexels.com/video-files/3969453/3969453-hd_1280_720_25fps.mp4",
    "https://videos.pexels.com/video-files/4065924/4065924-hd_1366_720_50fps.mp4",
    "https://videos.pexels.com/video-files/3969436/3969436-hd_1280_720_25fps.mp4",
  ];
  const [index, setIndex] = useState(0);

  return (
    <Card sx={{ width: "100%", height: "100%", padding: 0, borderRadius: 0 }}>
      <CardCover>
        <video key={index} autoPlay loop muted>
          <source src={videos[index]} type="video/mp4" />
        </video>
      </CardCover>
      <CardContent>
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <IconButton
            variant="plain"
            color="neutral"
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              color: "#ffffff",
              padding: 0,
            }}
          >
            <Avatar />
          </IconButton>
          <IconButton
            variant="plain"
            color="neutral"
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              color: "#ffffff",
              padding: 0,
            }}
          >
            <AddCircle
              sx={{
                width: "100%",
                height: "100%",
              }}
            />
          </IconButton>
          <IconButton
            variant="plain"
            color="neutral"
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              color: "#ffffff",
              padding: 0,
            }}
          >
            <Favorite
              sx={{
                width: "100%",
                height: "100%",
              }}
            />
          </IconButton>
          <IconButton
            variant="plain"
            color="neutral"
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              color: "#ffffff",
              padding: 0,
            }}
            onClick={() => {
              setIndex(Math.max(index - 1, 0) % videos.length);
            }}
          >
            <KeyboardArrowUp
              sx={{
                width: "100%",
                height: "100%",
              }}
            />
          </IconButton>
          <IconButton
            variant="plain"
            color="neutral"
            sx={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              color: "#ffffff",
              padding: 0,
            }}
            onClick={() => {
              setIndex((index + 1) % videos.length);
            }}
          >
            <KeyboardArrowDown
              sx={{
                width: "100%",
                height: "100%",
              }}
            />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Home;
