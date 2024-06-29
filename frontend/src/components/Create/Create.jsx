import { useState } from "react";
import { Box, Button, Card, CardContent, CardCover, Grid } from "@mui/joy";
import { combine, sharedClasses } from "../styles";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

const classes = {
  upload: { height: 80, width: 80, borderRadius: "50%", fontSize: 20 },
  button: { opacity: 0.5, fontSize: 20 },
  buttonGroup: {
    width: "100%",
    position: "absolute",
    margin: "auto",
    bottom: 0,
  },
};

const Create = () => {
  const user = useSelector((state) => state.app.user);
  const [videoSrc, setVideoSrc] = useState(null);
  const [file, setFile] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
      setFile(file);
    }
  };

  const handlePublish = async () => {
    const url = import.meta.env.VITE_CONTENT_UPLOAD_URL;
    const bucket = import.meta.env.VITE_CONTENT_STORAGE_BUCKET;
    const userId = user.profile.sub;
    const contentId = uuidv4();

    try {
      const response = await fetch(
        `${url}/prod/${bucket}/${userId}/${contentId}.mp4`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "video/mp4",
          },
          body: file,
        }
      );

      if (response.ok) {
        console.log("File uploaded successfully");
      } else {
        console.error("File upload failed", response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <Card sx={sharedClasses.card}>
      <CardCover>
        <video key={videoSrc} autoPlay loop muted>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </CardCover>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          {videoSrc == null ? (
            <Button
              variant="solid"
              color="neutral"
              component="label"
              sx={combine(sharedClasses.centerInParent, classes.upload)}
            >
              Upload
              <input
                id="upload-button"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: "none" }}
              />
            </Button>
          ) : (
            <Grid container sx={classes.buttonGroup}>
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="danger"
                  onClick={() => setVideoSrc(null)}
                  sx={classes.button}
                >
                  Discard
                </Button>
              </Grid>
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="success"
                  onClick={handlePublish}
                  sx={classes.button}
                >
                  Publish
                </Button>
              </Grid>
            </Grid>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Create;
