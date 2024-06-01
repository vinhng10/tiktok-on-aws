import { useState } from "react";
import { Create, Home, Profile } from "./components";
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
      <Box sx={{ flexGrow: 1, height: "100%", width: "100%" }}>
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

      <Box sx={{ marginTop: "auto", width: "100%" }}>
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
