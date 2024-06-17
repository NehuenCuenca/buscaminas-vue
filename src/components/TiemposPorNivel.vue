<template>
    <div class="tiempos-por-nivel">
        <h3 class="tiempos-por-nivel__titulo">Tus mejores tiempos en el nivel: <span class="nivel-actual">{{ nivel }}</span></h3>
        <ul class="lista-mejores-tiempos">
            <li v-for="({ timer, fecha}, index) in ultimosTiemposSegunNivel" 
                :key="index" class="mejor-tiempo-item"> 
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
.tiempos-por-nivel{
    min-width: max-content;
    border-radius: 1rem;
    padding: 1rem;
    background-color: darkslategray;
}

.tiempos-por-nivel__titulo{
    font: normal normal 400 1.3rem var(--display-font);
}

.nivel-actual {
    text-transform: uppercase;
    font: normal normal 700 1.5rem var(--display-font);
}

.lista-mejores-tiempos {
    margin: 1rem 0 0 0;
    padding: revert;
    font: normal normal 400 1.1rem var(--default-font);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}


.mejor-tiempo-item::marker {
    font-size: 1.5rem;
}

.mejor-tiempo-item:nth-child(1){
    list-style: '🥇';
}
.mejor-tiempo-item:nth-child(2){
    list-style: '🥈';
}
.mejor-tiempo-item:nth-child(3){
    list-style: '🥉';
}

</style>