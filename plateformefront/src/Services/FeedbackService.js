import { api } from "./Api";

export const envoyerFeedback = (subject, comment, rating = null) =>
  api.post("/feedback", { subject, comment, rating });

export const getAllFeedbacks = () => api.get("/feedback");

export const getMesFeedbacks = () => api.get("/feedback/mes-feedbacks");