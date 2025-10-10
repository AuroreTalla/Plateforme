import { useState } from "react";
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import ScienceIcon from '@mui/icons-material/Science';
import ForumIcon from '@mui/icons-material/Forum';
import FeedbackIcon from '@mui/icons-material/Feedback';
import CalculateIcon from '@mui/icons-material/Calculate';
import BiotechIcon from '@mui/icons-material/Biotech';

import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: { width: `calc(${theme.spacing(8)} + 1px)` },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && openedMixin(theme)),
    ...(!open && closedMixin(theme)),
    '& .MuiDrawer-paper': open ? openedMixin(theme) : closedMixin(theme),
  }),
);

export default function Sidebar({ name, email }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDrawer = () => setOpen(prev => !prev);

  return (
    <Drawer variant="permanent" open={open}>
      <Box display="flex" justifyContent="flex-end" p={1}>
        <IconButton onClick={toggleDrawer}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary={name} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText secondary={email} />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Accueil" />
          </ListItemButton>
        </ListItem>

        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("math")}>
            <ListItemIcon><CalculateIcon /></ListItemIcon>
            <ListItemText primary="Maths" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("phys")}>
            <ListItemIcon><BiotechIcon /></ListItemIcon>
            <ListItemText primary="Phys" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("chim")}>
            <ListItemIcon><ScienceIcon /></ListItemIcon>
            <ListItemText primary="Chim" />
          </ListItemButton>
        </ListItem>

        <Divider />

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("forum")}>
            <ListItemIcon><ForumIcon /></ListItemIcon>
            <ListItemText primary="Forum" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon><FeedbackIcon /></ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
