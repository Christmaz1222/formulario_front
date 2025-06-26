<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">

        <v-card class="pa-4 mb-6">
          <v-card-title class="text-h5 text-center">Buscador de Funcionarios</v-card-title>
          <v-card-subtitle class="text-center">Ingrese el Carnet de Identidad para buscar</v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="9">
                <v-text-field
                  v-model="ci"
                  label="Carnet de Identidad"
                  variant="outlined"
                  density="compact"
                  @keydown.enter="buscarFuncionario"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3">
                <v-btn
                  @click="buscarFuncionario"
                  :loading="cargando"
                  color="primary"
                  block
                  height="40"
                >
                  Buscar
                </v-btn>
              </v-col>
            </v-row>

            <v-alert
              v-if="error"
              type="error"
              class="mt-4"
              variant="tonal"
              border="start"
              density="compact"
            >
              {{ error }}
            </v-alert>
             </v-card-text>
        </v-card>

        <div v-if="funcionario">
          <v-card class="pa-4 mb-6">
            <v-card-title>Datos del Funcionario</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6"><v-text-field label="CI" v-model="funcionario.ci" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Nombres" v-model="funcionario.nombres_completos" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Apellido Paterno" v-model="funcionario.apellido_paterno" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Apellido Materno" v-model="funcionario.apellido_materno" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Grado" v-model="funcionario.grado" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Escalafón" v-model="funcionario.escalafon" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12"><v-text-field label="Destino Actual" v-model="funcionario.destino_actual" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Celular" v-model="funcionario.celular" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Email" v-model="funcionario.email" readonly variant="filled"></v-text-field></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="pa-4">
            <v-card-title>Naturaleza de la solicitud</v-card-title>
            <v-card-text>
              <v-form ref="solicitudForm" @submit.prevent="habilitarFuncionario">
                <v-select
                  v-model="solicitudData.naturaleza"
                  :items="opcionesNaturaleza"
                  :rules="reglas.requerido"
                  label="Naturaleza"
                  class="mb-2"
                ></v-select>
                <v-text-field
                  v-model="solicitudData.nro_deposito"
                  label="Nro. Deposito"
                  class="mb-2"
                ></v-text-field>
                <v-text-field
                  v-model="solicitudData.departamento"
                  label="Departamento"
                  class="mb-2"
                ></v-text-field>
                <v-alert
                  v-if="alertaHabilitacion.show"
                  :type="alertaHabilitacion.type"
                  class="mt-4"
                  variant="tonal"
                >
                  {{ alertaHabilitacion.message }}
                </v-alert>
                <v-btn type="submit" :loading="habilitando" color="success" block class="mt-4">
                  Guardar Registro
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

// --- Estado del Buscador ---
const ci = ref('');
const funcionario = ref(null);
const cargando = ref(false);
const error = ref(null);
const reglas = { requerido: [v => !!v || 'Este campo es requerido.'] };

// --- Estado del Formulario de Habilitación ---
const solicitudForm = ref(null);
const habilitando = ref(false);
const alertaHabilitacion = reactive({ show: false, type: 'success', message: '' });
const solicitudData = reactive({
  naturaleza: null,
  nro_deposito: '',
  departamento: ''
});
const opcionesNaturaleza = [
  'Examen de Ascenso',
  'Curso de Pre grado',
  'Curso Post grado',
  'Otro - Describir'
];

// --- Lógica de Búsqueda ---
const buscarFuncionario = async () => {
  if (!ci.value.trim()) {
    error.value = 'Por favor, ingrese un número de CI.';
    return;
  }
  cargando.value = true;
  funcionario.value = null;
  error.value = null;
  alertaHabilitacion.show = false;
  solicitudForm.value?.reset();

  try {
    const response = await axios.get(`http://localhost:3000/api/funcionarios/ci/${ci.value}`);
    funcionario.value = response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      error.value = 'No se encontró ningún funcionario con ese Carnet de Identidad.';
    } else {
      error.value = 'Ocurrió un error al conectar con el servidor.';
    }
    console.error('Error en la búsqueda:', err);
  } finally {
    cargando.value = false;
  }
};

// --- Lógica de Habilitación ---
const habilitarFuncionario = async () => {
  const { valid } = await solicitudForm.value.validate();
  if (!valid) return;

  habilitando.value = true;
  alertaHabilitacion.show = false;

  const payload = {
    funcionario_id: funcionario.value.id,
    ...solicitudData
  };

  try {
    await axios.post('http://localhost:3000/api/habilitaciones', payload);
    alertaHabilitacion.type = 'success';
    alertaHabilitacion.message = '¡Funcionario habilitado para el examen exitosamente!';
    alertaHabilitacion.show = true;
  } catch (err) {
    alertaHabilitacion.type = 'error';
    if (err.response && err.response.status === 409) {
      alertaHabilitacion.message = err.response.data.message;
    } else {
      alertaHabilitacion.message = 'Ocurrió un error al intentar habilitar al funcionario.';
    }
    alertaHabilitacion.show = true;
  } finally {
    habilitando.value = false;
  }
};
</script>
