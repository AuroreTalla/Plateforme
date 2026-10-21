import { api } from "./Api";

export const uploadFichier = (file, categorie, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("categorie", categorie);

  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (e.total && onProgress) onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });
};