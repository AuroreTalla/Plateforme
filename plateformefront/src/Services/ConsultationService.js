import { api } from "./Api";

export const enregistrerConsultation = (type, id) =>
  api.post("/consultations", { type, id });