import { useEffect, useState } from "react";
import { Create, Home, Profile, styles } from "./components";
import { Box } from "@mui/joy";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";
const { combine, sharedClasses } = styles;

const classes = {
  main: { height: "90vh", width: "30vw", backgroundColor: "#f0f0f0" },
  bottomNav: { marginTop: "auto", width: "100%" },
};

const App = () => {
  const accessToken = !!sessionStorage.getItem("accessToken");
  const [page, setPage] = useState("auth");

  useEffect(() => {
    if (!accessToken) {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");

      if (code) {
        console.log("===>", page, code);
        fetch(
          "https://tiktok-clone.auth.us-east-1.amazoncognito.com/oauth2/token",
          {
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
          }
        )
          .then((response) => response.json())
          .then((data) => {
            if (!data.hasOwnProperty("error")) {
              sessionStorage.setItem("idToken", data.id_token || "");
              sessionStorage.setItem("accessToken", data.access_token || "");
              sessionStorage.setItem("refreshToken", data.refresh_token || "");
              setPage("home");
            }
          })
          .catch((error) => console.error("Error:", error));
      } else {
        console.log("window.location.href");
        window.location.href = `https://tiktok-clone.auth.us-east-1.amazoncognito.com/login?client_id=${
          import.meta.env.VITE_CLIENT_ID
        }&response_type=code&scope=email+openid+phone&redirect_uri=${
          import.meta.env.VITE_REDIRECT_URI
        }`;
      }
    } else {
      setPage("home");
    }
  }, [accessToken]);

  const handleChange = (event, newPage) => {
    setPage(newPage);
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

export default App;
