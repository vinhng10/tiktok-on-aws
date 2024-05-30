import { useState } from "react";
import { Home, Profile } from "./components";
import { Box } from "@mui/joy";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PersonIcon from "@mui/icons-material/Person";

const App = () => {
  const [page, setPage] = useState("home");

  const handleChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "90vh",
        width: "30vw",
        backgroundColor: "#f0f0f0",
        margin: "auto",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {page === "home" ? <Home /> : page === "profile" ? <Profile /> : <></>}
      <BottomNavigation
        sx={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          backgroundColor: "#fff",
        }}
        value={page}
        onChange={handleChange}
      >
        <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="Create"
          value="create"
          icon={<AddCircleIcon />}
        />
        <BottomNavigationAction
          label="Profile"
          value="profile"
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default App;
