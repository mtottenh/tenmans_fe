<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <!-- Loading Spinner -->
                <v-card v-if="loading" outlined>
                    <v-card-text>
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            class="ma-4"
                        ></v-progress-circular>
                        <span>Creating Pug...</span>
                    </v-card-text>
                </v-card>

                <!-- Error Message -->
                <v-alert v-else-if="error" type="error" outlined>
                    {{ error }}
                </v-alert>

                <!-- PugManager Component -->
                <PugManager v-else :lobby_id="pugId" lobby_type="pug" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "@/axios";
import { ref, onMounted } from "vue";
import PugManager from "@/components/ClaudePugManager.vue";

export default {
    name: "PugView",
    components: {
        PugManager,
    },
    data() {
        return {
            pugId: ref(null),
            loading: true,
            error: ref(null),
        };
    },
    async beforeMount() {
        this.pugId = this.$route.params.id;
        this.loading = false;
    },
};
</script>

<style scoped>
.v-card {
    margin-top: 20px;
}
</style>
