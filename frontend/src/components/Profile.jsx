import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";

const videos = Array.from({ length: 10 }).map(
  (_, index) => `Video ${index + 1}`
);

const Profile = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        height: "90vh",
        width: "30vw",
        backgroundColor: "#f0f0f0",
        margin: "auto",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        color: "#000000",
      }}
    >
      <Avatar variant="solid" sx={{ height: 70, width: 70 }} />
      <Typography variant="h6">Account Name</Typography>
      <Typography variant="body1" gutterBottom>
        123 Following | 456 Followers | 789 Total Likes
      </Typography>
      <Grid container sx={{ flexGrow: 1, overflowY: "auto" }}>
        {videos.map((video, index) => (
          <Grid item xs={4} key={index}>
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
      <BottomNavigation
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Create" icon={<AddCircleIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Box>
  );
};

export default Profile;
