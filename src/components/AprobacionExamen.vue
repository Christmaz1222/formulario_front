<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4 mb-6">
          <v-card-title class="text-h5 text-center">Revisión y Aprobación de Solicitud</v-card-title>
          <v-card-subtitle class="text-center">Ingrese el Código de Registro del formulario</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="9">
                <v-text-field
                  v-model="codigoBusqueda"
                  label="Código de Registro (ej: FORM-00001)"
                  variant="outlined"
                  density="compact"
                  @keydown.enter="buscarFormulario"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <v-btn @click="buscarFormulario" :loading="cargando" color="primary" block height="40">Buscar</v-btn>
              </v-col>
            </v-row>
            <v-alert v-if="errorBusqueda" type="error" class="mt-4" variant="tonal" border="start" density="compact">{{ errorBusqueda }}</v-alert>
          </v-card-text>
        </v-card>

        <div v-if="formularioEncontrado">
          <v-card class="pa-4">
            <v-card-title>Datos de la Solicitud Encontrada</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12"><v-text-field label="Código de Registro" v-model="formularioEncontrado.codigo_registro" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="CI Funcionario" v-model="formularioEncontrado.cedula" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Nombre Funcionario" :value="`${formularioEncontrado.nombre} ${formularioEncontrado.paterno} ${formularioEncontrado.materno}`" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Naturaleza" v-model="formularioEncontrado.naturaleza" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Nro. Depósito" v-model="formularioEncontrado.ndeposito" readonly variant="filled"></v-text-field></v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="habilitarParaExamenFinal" :loading="habilitando" color="success">
                Habilitar para Examen Final
              </v-btn>
            </v-card-actions>

            <v-alert v-if="alertaHabilitacion.show" :type="alertaHabilitacion.type" class="ma-3" variant="tonal" density="compact">
              {{ alertaHabilitacion.message }}
            </v-alert>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import apiClient from '@/api/axios.js';

// Estado para la búsqueda
const codigoBusqueda = ref('');
const cargando = ref(false);
const formularioEncontrado = ref(null);
const errorBusqueda = ref(null);

// Estado para la acción de habilitar
const habilitando = ref(false);
const alertaHabilitacion = reactive({ show: false, type: 'success', message: '' });

// Función para buscar el formulario por su código
const buscarFormulario = async () => {
  if (!codigoBusqueda.value.trim()) {
    errorBusqueda.value = 'Por favor, ingrese un código de registro.';
    return;
  }
  cargando.value = true;
  formularioEncontrado.value = null;
  errorBusqueda.value = null;
  alertaHabilitacion.show = false;

  try {
    const response = await apiClient.get(`/formularios/codigo/${codigoBusqueda.value}`);
    formularioEncontrado.value = response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      errorBusqueda.value = 'No se encontró ningún formulario con ese código.';
    } else {
      errorBusqueda.value = 'Ocurrió un error en el servidor.';
    }
    console.error("Error en la búsqueda por código:", err);
  } finally {
    cargando.value = false;
  }
};

// Función para habilitar finalmente para el examen
const habilitarParaExamenFinal = async () => {
  if (!formularioEncontrado.value) return;

  habilitando.value = true;
  alertaHabilitacion.show = false;

  // Preparamos el payload con los datos del formulario encontrado
  // para enviarlo a la tabla 'habilitar_examen'
  const payload = {
    id_habilitar: formularioEncontrado.value.id, // ID del formulario
    cedula: formularioEncontrado.value.cedula,
    grado: formularioEncontrado.value.grado,
    paterno: formularioEncontrado.value.paterno,
    materno: formularioEncontrado.value.materno,
    nombre: formularioEncontrado.value.nombre,
    escalafon: formularioEncontrado.value.escalafon,
    sexo: formularioEncontrado.value.sexo,
    celular: formularioEncontrado.value.celular,
    destino: formularioEncontrado.value.destino,
    estado: 'HABILITADO', // Estado por defecto
    codigo_registro: formularioEncontrado.value.codigo_registro,
  };

  try {
    await apiClient.post('/habilitar-examen', payload);
    alertaHabilitacion.type = 'success';
    alertaHabilitacion.message = `¡Funcionario con CI ${payload.cedula} habilitado para el examen final!`;
    alertaHabilitacion.show = true;
  } catch (err) {
    alertaHabilitacion.type = 'error';
    if (err.response && err.response.status === 409) {
      alertaHabilitacion.message = 'Este formulario ya fue habilitado anteriormente.';
    } else {
      alertaHabilitacion.message = 'Ocurrió un error al intentar habilitar.';
    }
    alertaHabilitacion.show = true;
    console.error("Error al habilitar para examen final:", err);
  } finally {
    habilitando.value = false;
  }
};
</script>
