<template>
    <div>
        <ul id="lista-niveles">
            <li v-for="(nivel, index) in Object.keys(dificultades)" :key="index"> 
                <button @click="setearNivel(nivel)" class="nivel" 
                :class="(dificultad.dificultadActual.nivel === nivel) ? 'seleccionado' : ''">{{ nivel }}</button>
            </li>
        </ul>
        <div id="info-nivel">
            <span><u>Filas:</u> {{ dificultad.dificultadActual.filas }}</span>
            <span><u>Columnas:</u> {{ dificultad.dificultadActual.columnas }} </span>
            <span><u>Minas:</u> {{ dificultad.dificultadActual.cantBombas}}</span>
        </div>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { dificultad } from "../stores/dificultad.js"
export default {
    name: 'Dificultades',
    setup () {

        const dificultades = ref({
            /* 'Test': {
                filas: 4,
                columnas: 4,
                cantBombas: Math.floor( ((3*4) * 0.10) )
            }, */
            'Facil': {
                filas: 8,
                columnas: 8,
                cantBombas: Math.floor( ((8*8) * 0.16) )
            },
            'Medio': {
                filas: 16,
                columnas: 16,
                cantBombas: Math.floor( ((16*16) * 0.16) )
            },
            'Dificil': {
                filas: 16,
                columnas: 30,
                cantBombas: Math.floor( ((16*30) * 0.21) )
            }
        })
        
        const setearNivel = (nivel) => { 
            if( nivel === dificultad.dificultadActual.nivel ) return
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
ul#lista-niveles{
    height: 10vh;
    width: 100%;
    padding: 2vh;
    list-style-type: none;
    display: flex;
    justify-content: space-around;
    align-items: center;
}
#lista-niveles li .nivel {
    cursor: pointer;
    text-transform: uppercase;
    font-size: 1.1rem;
    letter-spacing: 2px;
    padding: .4rem;
    border-radius: 1rem;
}

.nivel.seleccionado {
    background-color: darkcyan;
}

#info-nivel{
    display: flex;
    justify-content: space-around;
    column-gap: 2vw;
    padding: 3vh;
    border: 1px solid black;
    font-size: 1.2rem;
}
</style>