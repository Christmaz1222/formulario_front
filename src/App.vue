<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Sistema de Habilitación para Prueba Psicológica</v-app-bar-title>

      <template v-slot:extension>
        <v-tabs v-model="tab" align-tabs="center" grow>
          <v-tab value="buscador">Búsqueda y Solicitud</v-tab>
          <v-tab value="registro">Registrar Funcionario</v-tab>
          <v-tab value="habilitados">Lista de Solicitudes</v-tab>
          <v-tab value="aprobacion">Aprobación de Examen</v-tab>
        </v-tabs>
      </template>
    </v-app-bar>

    <v-main>
      <v-window v-model="tab">
        <v-window-item value="buscador">
          <FuncionarioBuscador />
        </v-window-item>

        <v-window-item value="registro">
          <FuncionarioRegistro />
        </v-window-item>

        <v-window-item value="habilitados">
          <HabilitadosLista />
        </v-window-item>

        <v-window-item value="aprobacion">
          <AprobacionExamen />
        </v-window-item>
      </v-window>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
// 3. Importamos el nuevo componente
import FuncionarioBuscador from '@/components/FuncionarioBuscador.vue';
import FuncionarioRegistro from '@/components/FuncionarioRegistro.vue';
import HabilitadosLista from '@/components/HabilitadosLista.vue';
import AprobacionExamen from '@/components/AprobacionExamen.vue';

const tab = ref('buscador');
</script>
