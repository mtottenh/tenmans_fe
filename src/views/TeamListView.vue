<!-- src/views/TeamsView.vue -->
<script setup>
import TeamList from '@/components/ActiveTeamList.vue'
import CreateNewTeamItem from '@/components/CreateNewTeamItem.vue';

</script>
<template>
    <main>
        <CreateNewTeamItem/>
        <h1>Currently Active Teams</h1>
        <TeamList />
    </main>
</template>