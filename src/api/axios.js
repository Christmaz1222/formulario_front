// src/api/axios.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api'
  // ¡Hemos quitado la sección 'headers' de aquí!
  // Esto permite que axios elija la cabecera correcta para cada petición.
});

export default apiClient;
