import { api } from "./Api";

export const uploadFichier = (file, categorie) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("categorie", categorie);

  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};