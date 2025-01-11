<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import axios from "@/axios";

const formData = ref({
    matchFormat: "bo1",
    team1Name: "",
    team2Name: "",
    mapPool: {},
});

const loading = ref(false);
const maps_ready = ref(false);
const showError = ref(false);
const errorMessage = ref("");
const router = useRouter();
const map_pool = ref([]);
const availableMaps = computed(() => {
    return map_pool.value;
});

const selectedMapCount = computed(() => {
    return Object.values(formData.value.mapPool).filter(Boolean).length;
});

const formRules = {
    teamName: [
        (v) => !!v || "Team name is required",
        (v) => v.length >= 2 || "Team name must be at least 2 characters",
        (v) => v.length <= 32 || "Team name must be less than 32 characters",
    ],
    mapPool: [
        () =>
            selectedMapCount.value >=
                (formData.value.matchFormat === "bo3" ? 3 : 1) ||
            `At least ${formData.value.matchFormat === "bo3" ? 3 : 1} maps must be selected`,
    ],
};

const valid = computed(() => {
    return (
        formData.value.team1Name &&
        formData.value.team2Name &&
        formData.value.team1Name !== formData.value.team2Name &&
        selectedMapCount.value >= (formData.value.matchFormat === "bo3" ? 3 : 1)
    );
});
const get_maps = async () => {
    const map_pool_response = await axios.get("/maps/");
    console.log(map_pool_response.data);
    return map_pool_response.data;
};

const getMapURL = (map_id) => {
    const url = `/maps/name/${map_id}/img`;
    const map_url = axios.getUri({ url });
    return map_url;
};
const handleSubmit = async () => {
    if (!valid.value) return;

    loading.value = true;
    showError.value = false;

    try {
        const selectedMaps = Object.entries(formData.value.mapPool)
            .filter(([_, selected]) => selected)
            .map(([mapId]) => mapId);

        const response = await axios.post("/fixtures/new_pug", {
            team_1: formData.value.team1Name.trim(),
            team_2: formData.value.team2Name.trim(),
            map_pool: selectedMaps,
            match_format: formData.value.matchFormat,
        });
        console.log("Resp: ");
        console.log(response);
        const matchId = response.data.id;
        console.log("Redirecting to : " + matchId);
        router.push({ name: "PugView", params: { id: matchId } });
    } catch (error) {
        showError.value = true;
        errorMessage.value = error.message;
    } finally {
        loading.value = false;
    }
};
onMounted(async () => {
    map_pool.value = await get_maps();
    console.log(map_pool.value);
    maps_ready.value = true;
});
</script>

<template>
    <v-container class="max-w-3xl">
        <v-card class="pa-6">
            <v-form @submit.prevent="handleSubmit">
                <h2 class="text-h4 mb-6">Create New PUG</h2>

                <!-- Error Alert -->
                <v-alert
                    v-if="showError"
                    type="error"
                    variant="tonal"
                    closable
                    class="mb-6"
                    @click:close="showError = false"
                >
                    {{ errorMessage }}
                </v-alert>

                <!-- Match Format -->
                <v-card-title class="px-0 pt-0">Match Format</v-card-title>
                <v-radio-group
                    v-model="formData.matchFormat"
                    inline
                    class="mb-6"
                >
                    <v-radio label="Best of 1" value="bo1"></v-radio>
                    <v-radio label="Best of 3" value="bo3"></v-radio>
                </v-radio-group>

                <!-- Team Names -->
                <v-row>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="formData.team1Name"
                            label="Team 1 Name"
                            :rules="formRules.teamName"
                            required
                            variant="outlined"
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                        <v-text-field
                            v-model="formData.team2Name"
                            label="Team 2 Name"
                            :rules="formRules.teamName"
                            required
                            variant="outlined"
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <!-- Map Pool -->
                <v-card-title class="px-0">Map Pool</v-card-title>
                <v-alert
                    v-if="
                        selectedMapCount <
                        (formData.matchFormat === 'bo3' ? 3 : 1)
                    "
                    type="warning"
                    variant="tonal"
                    class="mb-4"
                >
                    Select at least
                    {{ formData.matchFormat === "bo3" ? 3 : 1 }} maps
                </v-alert>

                <v-row v-if="maps_ready" class="map-grid mb-6">
                    <v-col
                        v-for="map in availableMaps"
                        :key="map.id"
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-card
                            :class="{ selected: formData.mapPool[map.name] }"
                            @click="
                                formData.mapPool[map.name] =
                                    !formData.mapPool[map.name]
                            "
                            class="map-card"
                        >
                            <v-img
                                :src="getMapURL(map.name)"
                                height="120"
                                cover
                                :class="{
                                    grayscale: !formData.mapPool[map.name],
                                }"
                            >
                                <template v-slot:placeholder>
                                    <v-row
                                        class="fill-height ma-0"
                                        align="center"
                                        justify="center"
                                    >
                                        <v-progress-circular
                                            indeterminate
                                            color="primary"
                                        ></v-progress-circular>
                                    </v-row>
                                </template>
                            </v-img>

                            <v-card-title class="pa-4 text-center">
                                {{ map.name }}
                                <v-icon
                                    :icon="
                                        formData.mapPool[map.name]
                                            ? 'mdi-check-circle'
                                            : 'mdi-checkbox-blank-circle-outline'
                                    "
                                    :color="
                                        formData.mapPool[map.name]
                                            ? 'success'
                                            : 'grey'
                                    "
                                    class="ml-2"
                                ></v-icon>
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Submit Button -->
                <v-card-actions class="px-0">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="warning"
                        size="large"
                        type="submit"
                        :loading="loading"
                        :disabled="!valid"
                    >
                        Create PUG
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>

<style scoped>
.map-card {
    cursor: pointer;
    transition: all 0.3s ease;
}

.map-card:hover {
    transform: scale(1.02);
}

.map-card.selected {
    border: 2px solid rgb(var(--v-theme-primary));
}

.grayscale {
    filter: grayscale(100%);
    opacity: 0.6;
}

.map-grid {
    max-height: 500px;
    overflow-y: auto;
}
</style>
