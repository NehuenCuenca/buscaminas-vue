<template>
    <div>
        <ul>
            <li v-for="(nivel, index) in Object.keys(dificultades)" :key="index"> 
                <button @click="setearNivel(nivel)">{{ nivel }}</button>
            </li>
        </ul>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { dificultad } from "../stores/dificultad.js"
export default {
    name: 'Dificultades',
    setup () {

        const dificultades = ref({
            'Facil': {
                filas: 8,
                columnas: 8,
                cantBombas: Math.floor( ((8*8) * 0,10) )
            },
            'Medio': {
                filas: 16,
                columnas: 16,
                cantBombas: Math.floor( ((16*16) * 0,40) )
            },
            'Dificil': {
                filas: 16,
                columnas: 30,
                cantBombas: Math.floor( ((16*30) * 0,40) )
            }
        })
        
        const setearNivel = (nivel) => { 
            if( nivel === dificultad.dificultadActual.nivel ) return
            console.log({nivel, ...dificultades.value[nivel]})
            dificultad.setearDificultad({nivel, ...dificultades.value[nivel]})
        }

        onMounted(() => {
            const [ facil ] = Object.keys(dificultades.value)
            setearNivel(facil)
        })

        return {
            dificultades,
            setearNivel,
            dificultad
        }   
    }
}
</script>

<style scoped>
ul {
    height: 10vh;
    width: 100%;
    margin: 0;
    padding: 1vh;
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
ul li button {
    cursor: pointer;
}
</style>