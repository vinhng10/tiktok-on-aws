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
import { useSelector } from "react-redux";
import { getProperty } from "../utils";

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
  positive: { color: "#ff0000" },
};

const NewFeeds = () => {
  const user = useSelector((state) => state.app.user);
  const { newFeeds, setNewFeeds, loading, error } = useNewFeeds();
  const [index, setIndex] = useState(0);

  const handleLike = async () => {
    try {
      const newNewFeeds = [...newFeeds];

      const url = `${import.meta.env.VITE_API_URL}/like`;

      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: user.idToken,
      });

      const body = JSON.stringify({
        userId: getProperty(user.idToken, "sub"),
        contentId: newNewFeeds[index].content.id,
      });

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
      };

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      newNewFeeds[index].liked = true;
      setNewFeeds(newNewFeeds);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFollow = async () => {
    try {
      const newNewFeeds = [...newFeeds];

      const url = `${import.meta.env.VITE_API_URL}/follow`;

      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: user.idToken,
      });

      const body = JSON.stringify({
        userId: getProperty(user.idToken, "sub"),
        otherId: newNewFeeds[index].user.id,
      });

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: body,
      };

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      newNewFeeds.map((f) => {
        if (f.user.id === newNewFeeds[index].user.id) f.followed = true;
      });
      setNewFeeds(newNewFeeds);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    newFeeds.length &&
    !error && (
      <Card sx={sharedClasses.card}>
        <CardCover>
          <video key={index} autoPlay loop controls>
            <source src={newFeeds[index].content.url} type="video/mp4" />
          </video>
        </CardCover>
        <CardContent>
          <Box sx={combine(sharedClasses.flexColumn, classes.buttonGroup)}>
            <IconButton
              variant="solid"
              color="primary"
              sx={classes.iconButton}
              onClick={() => {
                console.log("==>", newFeeds[index].user);
              }}
            >
              <Avatar />
            </IconButton>
            <IconButton
              variant="solid"
              color="primary"
              sx={
                newFeeds[index].followed
                  ? combine(classes.iconButton, classes.positive)
                  : classes.iconButton
              }
              onClick={async () => {
                await handleFollow();
              }}
            >
              <AddCircle sx={sharedClasses.fitParent} />
            </IconButton>
            <IconButton
              variant="solid"
              color="primary"
              sx={
                newFeeds[index].liked
                  ? combine(classes.iconButton, classes.positive)
                  : classes.iconButton
              }
              onClick={async () => {
                await handleLike();
              }}
            >
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
