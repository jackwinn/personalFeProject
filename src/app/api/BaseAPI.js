import axios from 'axios';

export const baseAPI = axios.create({
  baseURL: process.env.REACT_APP_BACKEND 
});

