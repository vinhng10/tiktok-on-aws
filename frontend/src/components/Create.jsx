import { useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PublishIcon from "@mui/icons-material/Publish";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardCover,
  Grid,
  IconButton,
} from "@mui/joy";

const VideoUpload = () => {
  const [videoSrc, setVideoSrc] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoSrc(videoURL);
    }
  };

  const handlePublish = () => {
    // Implement your publish logic here
    alert("Publish functionality is not implemented yet.");
  };

  return (
    <Card sx={{ height: "100%", padding: 0, border: "none", borderRadius: 0 }}>
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
              sx={{
                margin: "auto",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                width: 80,
                borderRadius: "50%",
                fontSize: 20,
              }}
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
            <Grid
              container
              sx={{
                width: "100%",
                position: "absolute",
                margin: "auto",
                bottom: 0,
              }}
            >
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="danger"
                  onClick={() => setVideoSrc(null)}
                  sx={{ opacity: 0.5 }}
                >
                  Discard
                </Button>
              </Grid>
              <Grid xs={6}>
                <Button
                  fullWidth
                  variant="solid"
                  color="success"
                  onClick={(e) => console.log(e)}
                  sx={{ opacity: 0.5 }}
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

export default VideoUpload;
