<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-card>
          <v-card-title class="text-h5 text-center">
            Lista de Solicitudes Registradas
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="solicitudes"
              :loading="cargando"
              item-value="id"
              class="elevation-1"
              density="compact"
            >
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@5"></v-skeleton-loader>
              </template>
              <template v-slot:no-data>
                <v-alert type="info" class="ma-2">
                  No hay solicitudes registradas todavía.
                </v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/api/axios.js';

const cargando = ref(true);
const solicitudes = ref([]);

// Definimos las columnas para nuestra tabla
// Las 'key' deben coincidir con los nombres de las columnas en tu tabla 'formulario'
const headers = [
  { title: 'Código de Registro', key: 'codigo_registro' },
  { title: 'CI', key: 'cedula' },
  { title: 'Nombre Completo', key: 'nombre_completo' }, // Creamos esta propiedad más abajo
  { title: 'Grado', key: 'grado' },
  { title: 'Naturaleza', key: 'naturaleza' },
  { title: 'Fecha de Creación', key: 'fecha_creacion' },
];

// onMounted se ejecuta cuando el componente se carga
onMounted(async () => {
  try {
    // Llamamos al nuevo endpoint que creamos en el backend
    const response = await apiClient.get('/formularios');

    // Procesamos los datos para que se vean bien en la tabla
    solicitudes.value = response.data.map(item => ({
      ...item,
      // Unimos los nombres para una mejor visualización
      nombre_completo: `${item.nombre} ${item.paterno} ${item.materno}`,
      // Formateamos la fecha
      fecha_creacion: new Date(item.fecha_creacion).toLocaleString('es-BO'),
    }));
  } catch (error) {
    console.error("Error al cargar la lista de solicitudes:", error);
  } finally {
    cargando.value = false;
  }
});
</script>
