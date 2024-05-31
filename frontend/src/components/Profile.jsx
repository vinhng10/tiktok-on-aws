import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";

const videos = Array.from({ length: 10 }).map(
  (_, index) => `Video ${index + 1}`
);

const Profile = () => {
  return (
    <Box
      p={0}
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
        }}
      >
        {videos.map((video, index) => (
          <Grid xs={4} key={index}>
            <Card sx={{ borderRadius: 0, border: "none" }}>
              <CardCover>
                <video
                  autoPlay
                  loop
                  muted
                  poster="https://assets.codepen.io/6093409/river.jpg"
                >
                  <source
                    src="https://assets.codepen.io/6093409/river.mp4"
                    type="video/mp4"
                  />
                </video>
              </CardCover>
              <CardContent>
                <Box height={130}></Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Profile;
