<template>
    <div class="PlayerProfile">
        <h1>Welcome To Your Profile {{ user.name }}</h1>
        <table>
            <tbody>
            <tr>
                <th>Name</th>
                <th>{{  user.name }}</th>
                
            </tr>
            <tr>
                <th>Email</th>
                <th>{{ user.email }}</th>
            </tr>
            <tr>
                <th>SteamID</th>
                <th>{{ user.SteamID }}</th>
            </tr>
            <tr>
                <th>Signup Date</th>
                <th>{{ user.created_at }}</th>
            </tr>
            <tr>
                <th>Last Modified</th>
                <th>{{ user.update_at }}</th>
            </tr>
        </tbody>
        </table>
        <p v-if="errorMessage" class="error">{{  errorMessage }}</p>
    </div>
</template>


<script>
import axios from '@/axios'
import { useAuthStore } from '@/stores/authStore';
export default {
    data() {
        return {
        user: '',
        active_season: '',
        errorMessage: ''
        }
    },
    methods: {
        async getPlayerDetails() {
            const authStore = useAuthStore()

            try {
                const response = await axios.get('/players/me')
                this.user = response.data
            } catch (error) {
                this.errorMessage = error.message;
            }
        }
    },
    async beforeMount() {
        await this.getPlayerDetails();
    },
};
</script>