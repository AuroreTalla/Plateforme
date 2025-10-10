import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from "@mui/material/Chip";
import CoursC from './CoursC.jsx';
import ExoC from './ExoC.jsx';
function Chim() {
    const [active, setActive] = useState("coursC"); // Par défaut Cours1 actif

  return (
    <div>
      <ButtonGroup variant="contained" aria-label="Basic button group">

      {/* BOUTON / CHIP 1 */}
      {active === "coursC" ? (
        <Chip label="Cours" color="primary" />
      ) : (
        <Button variant="contained" onClick={() => setActive("coursC")}>
          Cours
        </Button>
      )}

      {/* BOUTON / CHIP 2 */}
      {active === "exoC" ? (
        <Chip label="Exo" color="primary" />
      ) : (
        <Button variant="contained" onClick={() => setActive("exoC")}>
          Exo
        </Button>
      )}
      </ButtonGroup>


      {/* AFFICHAGE DU CONTENU */}
      <div style={{ marginTop: 20 }}>
        {active === "coursC" ? <CoursC /> : <ExoC />}
      </div>
    </div>
  );
}

export default Chim;