<template>
    <div class="info-nivel">
        <span><u>Filas:</u> {{ dificultad.dificultadActual.filas }}</span>
        <span><u>Columnas:</u> {{ dificultad.dificultadActual.columnas }} </span>
        <span><u>Minas:</u> {{ dificultad.dificultadActual.cantBombas}}</span>
    </div>
</template>

<script>
import { dificultad } from "../stores/dificultad.js"
export default {
    name: 'InfoNivelActual',

    setup () {
        return {
            dificultad
        }   
    }
}
</script>

<style scoped>
.info-nivel{
    width: 100%;
    display: flex;
    justify-content: space-between;
    column-gap: .5rem;
    font: normal normal 400 1.2rem var(--default-font);
}
</style>