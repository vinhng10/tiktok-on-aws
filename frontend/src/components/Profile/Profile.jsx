import { Logout } from "@mui/icons-material";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Grid from "@mui/joy/Grid";
import Typography from "@mui/joy/Typography";
import { combine, sharedClasses } from "../styles";
import { IconButton } from "@mui/joy";
import { useDispatch } from "react-redux";
import { setPage, setUser } from "../App/appSlice";
import { useContents } from "../../hooks";

const classes = {
  avatar: { width: 56, height: 56, mt: 1 },
  stats: { display: "flex", justifyContent: "space-around" },
  grid: {
    height: "0px",
    flexGrow: 1,
    overflowY: "auto",
    scrollbarWidth: "none",
    width: "100%",
  },
  gridItem: {
    borderRadius: 0,
    border: "none",
    height: "130px",
  },
  iconButton: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    padding: "2px",
    position: "absolute",
    right: 0,
    margin: 1,
  },
};

const Profile = ({ userId }) => {
  const { contents, loading, error } = useContents(userId);
  const dispatch = useDispatch();

  return (
    <Box
      sx={combine(sharedClasses.flexColumn, {
        height: "100%",
      })}
    >
      <IconButton
        variant="outlined"
        color="primary"
        sx={classes.iconButton}
        onClick={() => {
          dispatch(setUser(null));
          dispatch(setPage("auth"));
          window.location.href =
            `${import.meta.env.VITE_AUTH_URL}/logout?` +
            new URLSearchParams({
              client_id: import.meta.env.VITE_USER_POOL_CLIENT_ID,
              logout_uri: import.meta.env.VITE_REDIRECT_URI,
            });
        }}
      >
        <Logout sx={sharedClasses.fitParent} />
      </IconButton>
      <Avatar variant="solid" sx={classes.avatar} />
      <Typography variant="plain">Account Name</Typography>
      <Box gap={2} sx={classes.stats}>
        <Typography>Following: 123</Typography>
        <Typography>Followers: 456</Typography>
        <Typography>Likes: 789</Typography>
      </Box>
      <Grid container sx={classes.grid}>
        {contents.map((content, index) => (
          <Grid xs={4} key={index}>
            <Card sx={classes.gridItem}>
              <CardCover>
                <video autoPlay loop muted>
                  <source src={content.url} type="video/mp4" />
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
