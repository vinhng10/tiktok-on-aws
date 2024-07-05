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
import { combine, sharedClasses } from "../styles";
import { useNewFeeds } from "../../hooks";

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

const NewFeeds = () => {
  const { newFeeds, loading, error } = useNewFeeds();
  const [index, setIndex] = useState(0);

  return (
    newFeeds.length &&
    !error && (
      <Card sx={sharedClasses.card}>
        <CardCover>
          <video key={index} autoPlay loop controls>
            <source src={newFeeds[index].url} type="video/mp4" />
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
                setIndex(Math.max(index - 1, 0) % newFeeds.length);
              }}
            >
              <KeyboardArrowUp sx={sharedClasses.fitParent} />
            </IconButton>
            <IconButton
              variant="solid"
              color="primary"
              sx={classes.iconButton}
              onClick={() => {
                setIndex((index + 1) % newFeeds.length);
              }}
            >
              <KeyboardArrowDown sx={sharedClasses.fitParent} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    )
  );
};

export default NewFeeds;
