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
                <v-btn @click="buscarFuncionario" :loading="cargando" color="primary" block height="40">Buscar</v-btn>
              </v-col>
            </v-row>
            <v-alert v-if="error" type="error" class="mt-4" variant="tonal" border="start" density="compact">{{ error }}</v-alert>
          </v-card-text>
        </v-card>

        <div v-if="funcionario">
          <v-card class="pa-4 mb-6">
            <v-card-title>Datos del Funcionario</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6"><v-text-field label="CI" v-model="funcionario.cedula" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Nombres" v-model="funcionario.nombres" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Apellido Paterno" v-model="funcionario.paterno" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Apellido Materno" v-model="funcionario.materno" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Grado" v-model="funcionario.grado" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Escalafón" v-model="funcionario.escalafon" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12"><v-text-field label="Destino Actual" v-model="funcionario.destino" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Celular" v-model="funcionario.celular" readonly variant="filled"></v-text-field></v-col>
                <v-col cols="12" sm="6"><v-text-field label="Email" v-model="funcionario.email" readonly variant="filled"></v-text-field></v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="pa-4">
            <v-card-title>Naturaleza de la solicitud</v-card-title>
            <v-card-text>
              <v-form ref="solicitudForm" @submit.prevent="habilitarFuncionario">
                <v-text-field v-if="codigoGenerado" label="Código de Registro Generado" v-model="codigoGenerado" readonly variant="filled" class="mb-2"></v-text-field>
                <v-select v-model="solicitudData.naturaleza" :items="opcionesNaturaleza" :rules="reglas.requerido" label="Naturaleza" class="mb-2"></v-select>
                <v-text-field v-model="solicitudData.nro_deposito" label="Nro. Deposito" class="mb-2"></v-text-field>
                <v-text-field v-model="solicitudData.departamento" label="Departamento" class="mb-2"></v-text-field>

                <v-file-input v-model="solicitudData.imagen" label="Adjuntar imagen del depósito" accept="image/*" variant="outlined" density="compact" class="mb-2"></v-file-input>

                <v-alert v-if="alertaHabilitacion.show" :type="alertaHabilitacion.type" class="mt-4" variant="tonal">{{ alertaHabilitacion.message }}</v-alert>
                <v-btn type="submit" :loading="habilitando" color="success" block class="mt-4">Guardar Solicitud</v-btn>
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
import apiClient from '@/api/axios.js';
import jsPDF from 'jspdf'; // <-- 1. IMPORTAMOS LA LIBRERÍA

// ... (todas tus variables de estado 'ref' y 'reactive' se quedan igual)
const ci = ref('');
const funcionario = ref(null);
const cargando = ref(false);
const error = ref(null);
const reglas = { requerido: [v => !!v || 'Este campo es requerido.'] };
const solicitudForm = ref(null);
const habilitando = ref(false);
const alertaHabilitacion = reactive({ show: false, type: 'success', message: '' });
const codigoGenerado = ref('');
const opcionesNaturaleza = ['Ascenso', 'Postulacion', 'Reincorporacion', 'Otro'];
const solicitudData = reactive({
  naturaleza: null,
  nro_deposito: '',
  departamento: '',
  imagen: [],
});

// --- 2. NUEVA FUNCIÓN PARA CREAR EL PDF ---
const generarPDF = (funcionarioInfo, solicitudInfo, codigoReg) => {
  // Creamos una nueva instancia de jsPDF
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Comprobante de Solicitud de Examen', 105, 20, { align: 'center' });

  // Código de Registro
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Código de Registro: ${codigoReg}`, 20, 35);
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString('es-BO')}`, 190, 35, { align: 'right' });

  // Línea divisoria
  doc.line(20, 40, 190, 40);

  // Sección de Datos del Funcionario
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos del Funcionario', 20, 50);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  let y = 60; // Posición vertical inicial
  doc.text(`CI: ${funcionarioInfo.cedula}`, 20, y);
  doc.text(`Nombre Completo: ${funcionarioInfo.nombres} ${funcionarioInfo.paterno} ${funcionarioInfo.materno}`, 20, y += 7);
  doc.text(`Grado: ${funcionarioInfo.grado}`, 20, y += 7);
  doc.text(`Destino Actual: ${funcionarioInfo.destino}`, 20, y += 7);
  doc.text(`Celular: ${funcionarioInfo.celular}`, 20, y += 7);

  // Sección de Datos de la Solicitud
  y += 14; // Dejamos un espacio
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Datos de la Solicitud', 20, y);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  y += 10;
  doc.text(`Naturaleza: ${solicitudInfo.naturaleza}`, 20, y);
  doc.text(`Nro. Depósito: ${solicitudInfo.nro_deposito}`, 20, y += 7);
  doc.text(`Departamento: ${solicitudInfo.departamento}`, 20, y += 7);

  // Guardar el archivo
  // El navegador automáticamente iniciará la descarga
  doc.save(`comprobante-${codigoReg}.pdf`);
};


// ... (la función buscarFuncionario no cambia)
const buscarFuncionario = async () => {
  if (!ci.value.trim()) { error.value = 'Por favor, ingrese un número de CI.'; return; }
  cargando.value = true;
  funcionario.value = null;
  error.value = null;
  alertaHabilitacion.show = false;
  codigoGenerado.value = '';
  if (solicitudForm.value) { solicitudForm.value.reset(); }
  try {
    const response = await apiClient.get(`/funcionarios/ci/${ci.value}`);
    funcionario.value = response.data;
  } catch (err) {
    error.value = 'Ocurrió un error o el funcionario no fue encontrado.';
    console.error('Error en la búsqueda:', err);
  } finally {
    cargando.value = false;
  }
};


// --- 3. FUNCIÓN DE GUARDADO MODIFICADA ---
const habilitarFuncionario = async () => {
  // ... (toda la primera parte de la función no cambia: validación, FormData, etc.)
  if (!solicitudForm.value) return;
  const { valid } = await solicitudForm.value.validate();
  if (!valid) return;
  habilitando.value = true;
  alertaHabilitacion.show = false;
  const formData = new FormData();
  formData.append('cedula', funcionario.value.cedula);
  formData.append('grado', funcionario.value.grado);
  formData.append('paterno', funcionario.value.paterno);
  formData.append('materno', funcionario.value.materno);
  formData.append('nombre', funcionario.value.nombres);
  formData.append('escalafon', funcionario.value.escalafon);
  formData.append('celular', funcionario.value.celular);
  formData.append('email', funcionario.value.email);
  formData.append('naturaleza', solicitudData.naturaleza);
  formData.append('ndeposito', solicitudData.nro_deposito);
  formData.append('departamento', solicitudData.departamento);
  if (solicitudData.imagen && solicitudData.imagen.length > 0) {
    formData.append('archivo', solicitudData.imagen[0]);
  }

  try {
    const response = await apiClient.post('/formularios', formData);

    // Mostramos el mensaje de éxito y el código como antes
    alertaHabilitacion.type = 'success';
    alertaHabilitacion.message = '¡Solicitud guardada exitosamente! Generando PDF...';
    alertaHabilitacion.show = true;
    codigoGenerado.value = response.data.codigo_registro;

    // --- LLAMAMOS A LA FUNCIÓN PARA GENERAR EL PDF ---
    // Le pasamos los datos necesarios para construir el reporte
    generarPDF(funcionario.value, solicitudData, response.data.codigo_registro);

  } catch (err) {
    alertaHabilitacion.type = 'error';
    alertaHabilitacion.message = 'Ocurrió un error al guardar la solicitud.';
    console.error("Error al guardar:", err);
    alertaHabilitacion.show = true;
  } finally {
    habilitando.value = false;
  }
};
</script>
