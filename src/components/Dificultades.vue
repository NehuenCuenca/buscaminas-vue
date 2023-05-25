<template>
    <div>
        <ul id="lista-niveles">
            <li v-for="(nivel, index) in Object.keys(dificultades)" :key="index"> 
                <button @click="elegirNivel(nivel)" class="nivel" 
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
        
        const elegirNivel = (nivel) => { 
            if( nivel === dificultad.dificultadActual.nivel ) return
            dificultad.setearDificultad({nivel, ...dificultades.value[nivel]})
            centrarVistaAlTablero()
             
        }

        const centrarVistaAlTablero = () => { 
            const tablero = document.querySelector("#juego-tablero");
            tablero.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }

        onMounted(() => {
            const [ facil ] = Object.keys(dificultades.value)
            elegirNivel(facil)
        })

        return {
            dificultades,
            elegirNivel,
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
    color: #2c3e50;
    text-transform: uppercase;
    font-size: 1.1rem;
    letter-spacing: 2px;
    padding: .4rem .6rem;
    border-radius: .5rem;
    border-style: none;
}

#lista-niveles li .nivel.seleccionado {
    background-color: darkcyan;
    color: white;
    text-shadow: 2px 0 #2c3e50, -2px 0 #2c3e50, 0 2px #2c3e50, 0 -2px #2c3e50,
               1px 1px #2c3e50, -1px -1px #2c3e50, 1px -1px #2c3e50, -1px 1px #2c3e50;
}

#info-nivel{
    display: flex;
    justify-content: space-around;
    column-gap: 2vw;
    padding: 3vh;
    border: 3px solid #2c3e50;
    font-size: 1.2rem;
}
</style>