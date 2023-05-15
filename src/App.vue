<template>
  <h1>Buscaminas by Nehuen Cuenca</h1>
  <Dificultades/>
  <Tablero />
</template>

<script>
import Tablero from './components/Tablero.vue';
import Dificultades from './components/Dificultades.vue';

export default {
  name: 'App',
  components: { Tablero, Dificultades },
  setup() {}
}
</script>

<style>
#app {
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: white;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 2vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

html, body {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}

html{
    box-sizing: border-box;
    font-family: sans-serif;
}

*, *:before, *:after {
    box-sizing: inherit;
}

body {
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5vh 0 10vh 0;
  background-color: #2c3e50;
}

h1, h2, h3, h4 {
  margin: 0;
}
</style>
