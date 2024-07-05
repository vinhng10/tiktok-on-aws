import { useEffect } from "react";
import { Create, NewFeeds, Profile, styles } from "../../components";
import { Box } from "@mui/joy";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Feed";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setUser } from "./appSlice";
import { useManageTokens } from "../../hooks";
import { getProperty } from "../utils";
const { combine, sharedClasses } = styles;

const classes = {
  main: { height: "90vh", width: "30vw", backgroundColor: "#f0f0f0" },
  bottomNav: { marginTop: "auto", width: "100%" },
};

const _App = () => {
  const user = useSelector((state) => state.app.user);
  const page = useSelector((state) => state.app.page);
  const dispatch = useDispatch();
  useManageTokens();

  useEffect(() => {
    if (!user) {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      window.history.replaceState({}, document.title, url.toString());

      if (code) {
        fetch(`${import.meta.env.VITE_AUTH_URL}/oauth2/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: import.meta.env.VITE_USER_POOL_CLIENT_ID,
            code: code,
            redirect_uri: import.meta.env.VITE_REDIRECT_URI,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (!data.hasOwnProperty("error")) {
              const _user = {
                idToken: data.id_token,
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
          client_id: import.meta.env.VITE_USER_POOL_CLIENT_ID,
          response_type: "code",
          scope: "email+openid+phone",
          redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        });
        window.location.href =
          `${import.meta.env.VITE_AUTH_URL}/login?` +
          params.toString().replace(/%2B/g, "+");
      }
    } else {
      dispatch(setPage(page));
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
          <NewFeeds />
        ) : page === "profile" ? (
          <Profile userId={getProperty(user.idToken, "sub")} />
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
