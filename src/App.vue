<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-title>Sistema de habilitación para prueba Psicológica</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <FuncionarioBuscador />
    </v-main>
  </v-app>
</template>

<script setup>
  // 1. Importamos el componente que creamos en el paso anterior
  import FuncionarioBuscador from '@/components/FuncionarioBuscador.vue'
</script>
