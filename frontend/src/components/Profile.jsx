import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";

const Profile = () => {
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
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Avatar variant="solid" sx={{ width: 56, height: 56, mt: 1 }}></Avatar>
      <Typography variant="plain">Account Name</Typography>
      <Box gap={2} sx={{ display: "flex", justifyContent: "space-around" }}>
        <Typography>Following: 123</Typography>
        <Typography>Followers: 456</Typography>
        <Typography>Likes: 789</Typography>
      </Box>
      <Grid
        container
        sx={{
          height: "0px",
          flexGrow: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          width: "100%",
        }}
      >
        {videos.map((video, index) => (
          <Grid xs={4} key={index}>
            <Card
              sx={{
                borderRadius: 0,
                border: "none",
                height: "130px",
              }}
            >
              <CardCover>
                <video autoPlay loop muted>
                  <source src={video} type="video/mp4" />
                </video>
              </CardCover>
              <CardContent></CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
