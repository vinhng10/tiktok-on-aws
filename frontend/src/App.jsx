import { useState } from "react";
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
  const [page, setPage] = useState("home");

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
