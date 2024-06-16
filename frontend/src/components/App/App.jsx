import { useEffect } from "react";
import { Create, Home, Profile, styles } from "../../components";
import { Box } from "@mui/joy";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setUser } from "./appSlice";
const { combine, sharedClasses } = styles;

const classes = {
  main: { height: "90vh", width: "30vw", backgroundColor: "#f0f0f0" },
  bottomNav: { marginTop: "auto", width: "100%" },
};

const _App = () => {
  const user = useSelector((state) => state.app.user);
  const page = useSelector((state) => state.app.page);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (code) {
        fetch(`${import.meta.env.VITE_AUTH_URL}/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: import.meta.env.VITE_CLIENT_ID,
            code: code,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.hasOwnProperty("error")) {
              const _user = {
                profile: JSON.parse(atob(data.id_token.split(".")[1])),
                accessToken: data.access_token,
                refreshToken: data.refresh_token,
              };
              dispatch(setUser(_user));
              dispatch(setPage("home"));
            }
          })
          .catch((error) => console.error("Error:", error));
      } else {
        const params = new URLSearchParams({
          client_id: import.meta.env.VITE_CLIENT_ID,
          response_type: "code",
          scope: "email+openid+phone",
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        });
        window.location.href =
          `${import.meta.env.VITE_AUTH_URL}/login?` +
          params.toString().replace(/%2B/g, "+");
      }
    } else {
      dispatch(setPage("home"));
    }
  }, [user]);

  const handleChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  return (
    <Box
      sx={combine(
        sharedClasses.centerInParent,
        sharedClasses.flexColumn,
        classes.main
      )}
    >
      <Box sx={combine({ flexGrow: 1 }, sharedClasses.fitParent)}>
        {page === "home" ? (
          <Home />
        ) : page === "profile" ? (
          <Profile />
        ) : page === "create" ? (
          <Create />
        ) : (
          <></>
        )}
      </Box>

      <Box sx={classes.bottomNav}>
        <BottomNavigation value={page} onChange={handleChange}>
          <BottomNavigationAction value="home" icon={<HomeIcon />} />
          <BottomNavigationAction value="create" icon={<AddCircleIcon />} />
          <BottomNavigationAction value="profile" icon={<PersonIcon />} />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default _App;
