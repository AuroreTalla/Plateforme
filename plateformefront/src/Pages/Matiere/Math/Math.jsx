import { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from '@mui/material/ButtonGroup';
import Chip from "@mui/material/Chip";
import CoursM from './CoursM.jsx';
import ExoM from './ExoM.jsx';


 

export default function Math() {
  const [active, setActive] = useState("coursM"); // Par défaut Cours1 actif

  return (
    <div>
      <ButtonGroup variant="contained" aria-label="Basic button group">

      {/* BOUTON / CHIP 1 */}
      {active === "coursM" ? (
        <Chip label="Cours" color="primary" />
      ) : (
        <Button variant="contained" onClick={() => setActive("coursM")}>
          Cours
        </Button>
      )}

      {/* BOUTON / CHIP 2 */}
      {active === "exoM" ? (
        <Chip label="Exo" color="primary" />
      ) : (
        <Button variant="contained" onClick={() => setActive("exoM")}>
          Exo
        </Button>
      )}
      </ButtonGroup>


      {/* AFFICHAGE DU CONTENU */}
      <div style={{ marginTop: 20 }}>
        {active === "coursM" ? <CoursM /> : <ExoM />}
      </div>
    </div>
  );
}
