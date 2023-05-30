<template>
    <div id="tiemposPorNivel">
        <h3>Tus mejores tiempos en el nivel: <span id="nivelActual">{{ nivel }}</span></h3>
        <ul id="mejores-tiempos">
            <li v-for="({ timer, fecha}, index) in ultimosTiemposSegunNivel" 
                :key="index"> 
                <span> {{ timer }} segundos | {{ fechaFormateada(fecha) }}</span> 
            </li>
        </ul>
    </div>
</template>

<script>
import { onMounted, ref, toRefs } from 'vue'

export default {
    name: 'TiemposPorNivel',
    props: ["dificultad"],
    setup(props) {
        const ultimosTiemposSegunNivel = ref([]) 
        const { nivel } = toRefs(props.dificultad);

        onMounted(() => {
            const tiemposPorNivel = JSON.parse(localStorage.getItem('tiemposPorNivel'))
            ultimosTiemposSegunNivel.value = [ ...tiemposPorNivel[nivel.value] ]
        })

        const fechaFormateada = ( fecha ) => { 
            const constructorFecha = new Date(fecha)
            
            const hora = constructorFecha.getHours()
            const minutos = constructorFecha.getMinutes() > 9 ? constructorFecha.getMinutes(): '0'+constructorFecha.getMinutes()
            const dia = constructorFecha.getDate()
            const mes = constructorFecha.getMonth()+1
            const anio = constructorFecha.getFullYear()

            return `${hora}:${minutos} - ${dia}/${mes}/${anio}`
        }

        return {
            nivel,
            ultimosTiemposSegunNivel,
            fechaFormateada
        }
    }

}
</script>

<style scoped>
#tiemposPorNivel{
    border-radius: 1rem;
    padding: 1rem;
    background-color: darkslategray;
}

span#nivelActual {
    text-transform: uppercase;
}

ul#mejores-tiempos {
    width: auto;
    height: auto;
    margin: 0;
    font-size: 1.2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#mejores-tiempos li { width: 100%;}
#mejores-tiempos li::marker {
    font-size:1.7rem;
}

ul#mejores-tiempos li:nth-child(1){
    list-style: '🥇';
}
ul#mejores-tiempos li:nth-child(2){
    list-style: '🥈';
}
ul#mejores-tiempos li:nth-child(3){
    list-style: '🥉';
}

</style>