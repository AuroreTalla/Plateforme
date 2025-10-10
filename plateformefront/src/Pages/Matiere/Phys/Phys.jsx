import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from "@mui/material/Chip";
import CoursP from './CoursP.jsx';
import ExoP from './ExoP.jsx';



function Phys() {
    const [active, setActive] = useState("coursP"); // Par défaut Cours1 actif

  return (
    <div>
      <ButtonGroup variant="contained" aria-label="Basic button group">

      {/* BOUTON / CHIP 1 */}
      {active === "coursP" ? (
        <Chip label="Cours" color="primary" />
      ) : (
        <Button variant="contained" onClick={() => setActive("coursP")}>
          Cours
        </Button>
      )}

      {/* BOUTON / CHIP 2 */}
      {active === "exoP" ? (
        <Chip label="Exo" color="primary" />
      ) : (
        <Button variant="contained" onClick={() => setActive("exoP")}>
          Exo
        </Button>
      )}
      </ButtonGroup>


      {/* AFFICHAGE DU CONTENU */}
      <div style={{ marginTop: 20 }}>
        {active === "coursP" ? <CoursP /> : <ExoP />}
      </div>
    </div>
  );
}

export default Phys;