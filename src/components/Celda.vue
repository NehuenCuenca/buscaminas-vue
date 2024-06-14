<template>
    <div ref="celdaTemplate" 
        @click="mostrarCelda" @click.right.prevent="colocarBandera" 
        @mousedown.left="toggleClass" class="celda" :class="visible ? 'descubierta' : ''">
        {{ valorCelda }}
    </div>
</template>

<script>
import { computed, toRefs, ref, nextTick, watch, onMounted } from "vue";

export default {
    name: "Celda",
    props: ["celda"],
    setup(props, { emit }) {
        const { id, fila, columna, visible, tieneBomba, bandera, valor, explotar } = toRefs(props.celda);
        const celdaTemplate = ref(null);

        const valorCelda = computed(() => {
            let valorLocal;
            if (!visible.value && bandera.value) {
                valorLocal = "🚩";
            }
            if (visible.value) {
                valorLocal = tieneBomba.value ? "💣" : valor.value;
            }

            return valorLocal;
        });

        const colocarBandera = () => {
            if (visible.value) return;
            bandera.value = !bandera.value;
            emit("manejarBandera", props.celda, bandera.value);
        };

        const mostrarCelda = () => {
            if (bandera.value) return;
            if (visible.value && valor.value === "") return;
            if (!visible.value) { visible.value = true; }

            emit("manejarCelda", props.celda);
        };

        const toggleClass = () => {
            if (visible.value || bandera.value) return;
            celdaTemplate.value.classList.toggle("descubierta");
        };


        const explotarLocal = () => {
            nextTick(() => {
                celdaTemplate.value.classList.add("exploto");
            })
        }

        watch(explotar, explotarLocal)

        return {
            id,
            fila,
            columna,
            visible,
            tieneBomba,
            mostrarCelda,
            colocarBandera,
            valorCelda,
            celdaTemplate,
            toggleClass,
        };
    },
};
</script>

<style scoped>
.celda {
    cursor: pointer;
    border: 2px solid black;
    background-color: grey;
    color: var(--black);
    font: normal normal 600 1.2rem var(--default-font);
    min-height: 40px;
    min-width: 40px;
    display: grid;
    place-items: center;
    user-select: none;
}

.descubierta {
    background-color: gainsboro;
    cursor: auto;
}

.exploto {
    background-color: rgba(190, 0, 0, 0.7);
}
</style>
