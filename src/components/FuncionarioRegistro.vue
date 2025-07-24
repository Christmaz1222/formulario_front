<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5 text-center">
            Registro de Nuevo Funcionario
          </v-card-title>

          <v-card-text>
            <v-form ref="form" @submit.prevent="registrarFuncionario">
              <v-text-field
                v-model="funcionarioData.cedula"
                :rules="reglas.requerido"
                label="Carnet de Identidad (CI)"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="funcionarioData.nombre"
                :rules="reglas.requerido"
                label="Nombres Completos"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="funcionarioData.paterno"
                :rules="reglas.requerido"
                label="Apellido Paterno"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="funcionarioData.materno"
                label="Apellido Materno"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="funcionarioData.grado"
                label="Grado"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="funcionarioData.escalafon"
                label="Escalafón"
                class="mb-2"
              ></v-text-field>

              <v-text-field
                v-model="funcionarioData.destino"
                label="Destino Actual"
                class="mb-2"
              ></v-text-field>

               <v-text-field
                v-model="funcionarioData.celular"
                label="Celular"
                class="mb-2"
              ></v-text-field>

               <v-text-field
                v-model="funcionarioData.email"
                label="Email"
                class="mb-2"
              ></v-text-field>

              <v-alert
                v-if="alerta.show"
                :type="alerta.type"
                class="mt-4"
                variant="tonal"
              >
                {{ alerta.message }}
              </v-alert>

              <v-btn
                type="submit"
                :loading="cargando"
                color="success"
                block
                class="mt-4"
              >
                Registrar Funcionario
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import apiClient from '@/api/axios.js';

const form = ref(null);
const cargando = ref(false);
const alerta = reactive({ show: false, type: 'success', message: '' });

// Objeto reactivo con los campos del formulario
const funcionarioData = reactive({
  cedula: '',
  nombre: '',
  paterno: '',
  materno: '',
  grado: '',
  escalafon: '',
  destino: '',
  celular: '',
  email: ''
});

const reglas = {
  requerido: [v => !!v || 'Este campo es requerido.'],
};

const registrarFuncionario = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;

  cargando.value = true;
  alerta.show = false;

  try {
    // Usamos el endpoint de 'funcionarios' que es el correcto para el registro
    await apiClient.post('/funcionarios', funcionarioData);

    alerta.type = 'success';
    alerta.message = '¡Funcionario registrado exitosamente!';
    alerta.show = true;
    form.value.reset();

  } catch (err) {
    alerta.type = 'error';
    if (err.response && err.response.status === 409) {
      alerta.message = err.response.data.message; // CI ya registrado
    } else {
      alerta.message = 'Ocurrió un error en el servidor.';
    }
    console.error('Error al registrar:', err);
    alerta.show = true;
  } finally {
    cargando.value = false;
  }
};
</script>
