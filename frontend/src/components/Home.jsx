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
import { combine, sharedClasses } from "./styles";

const classes = {
  buttonGroup: {
    position: "absolute",
    gap: 2,
    bottom: 10,
    right: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    color: "#ffffff",
    padding: "2px",
  },
};

const Home = () => {
  const videos = [
    "https://videos.pexels.com/video-files/6060027/6060027-hd_1080_1920_25fps.mp4",
    "https://videos.pexels.com/video-files/15397891/15397891-hd_1080_1920_25fps.mp4",
    "https://videos.pexels.com/video-files/7244811/7244811-hd_1080_1920_25fps.mp4",
    "https://videos.pexels.com/video-files/20496059/20496059-hd_1080_1920_30fps.mp4",
    "https://videos.pexels.com/video-files/4053047/4053047-hd_1280_720_50fps.mp4",
    "https://videos.pexels.com/video-files/3969453/3969453-hd_1280_720_25fps.mp4",
    "https://videos.pexels.com/video-files/4065924/4065924-hd_1366_720_50fps.mp4",
    "https://videos.pexels.com/video-files/3969436/3969436-hd_1280_720_25fps.mp4",
  ];
  const [index, setIndex] = useState(0);

  return (
    <Card sx={sharedClasses.card}>
      <CardCover>
        <video key={index} autoPlay loop controls>
          <source src={videos[index]} type="video/mp4" />
        </video>
      </CardCover>
      <CardContent>
        <Box sx={combine(sharedClasses.flexColumn, classes.buttonGroup)}>
          <IconButton variant="solid" color="primary" sx={classes.iconButton}>
            <Avatar />
          </IconButton>
          <IconButton variant="solid" color="primary" sx={classes.iconButton}>
            <AddCircle sx={sharedClasses.fitParent} />
          </IconButton>
          <IconButton variant="solid" color="primary" sx={classes.iconButton}>
            <Favorite sx={sharedClasses.fitParent} />
          </IconButton>
          <IconButton
            variant="solid"
            color="primary"
            sx={classes.iconButton}
            onClick={() => {
              setIndex(Math.max(index - 1, 0) % videos.length);
            }}
          >
            <KeyboardArrowUp sx={sharedClasses.fitParent} />
          </IconButton>
          <IconButton
            variant="solid"
            color="primary"
            sx={classes.iconButton}
            onClick={() => {
              setIndex((index + 1) % videos.length);
            }}
          >
            <KeyboardArrowDown sx={sharedClasses.fitParent} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Home;
