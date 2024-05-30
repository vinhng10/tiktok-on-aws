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
    <>
      <Avatar
        variant="solid"
        sx={{ height: "70px", width: "70px", marginTop: "5px" }}
      />
      <Typography variant="plain">Account Name</Typography>
      <Typography variant="plain" gutterBottom>
        123 Following | 456 Followers | 789 Total Likes
      </Typography>
      <Grid
        container
        sx={{ flexGrow: 1, overflowY: "auto", scrollbarWidth: "none" }}
      >
        {videos.map((video, index) => (
          <Grid xs={4} key={index}>
            <Card>
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
    </>
  );
};

export default Profile;
