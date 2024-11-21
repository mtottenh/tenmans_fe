<template>
  <v-tabs
    v-model="internalValue"
    :active-class="`${color} ${$vuetify.theme.dark ? 'black' : 'white'}--text`"
    class="v-tabs--pill"
    hide-slider
    v-bind="$attrs"
  >
    <slot />

    <slot name="items" />
  </v-tabs>
</template>

<script setup>
  import {ref, watch} from 'vue';
  const internalValue = ref('')
  watch(() => props.color, (newColor) => { internalValue.value = newColor });
  const updateValute = () => {
     emit('update:modelValue', internalValue.value);
  }
  
</script>

<style lang="scss">
  .v-tabs--pill {
    .v-tab,
    .v-tab:before {
      border-radius: 24px;
    }

    &.v-tabs--icons-and-text {
      .v-tab,
      .v-tab:before {
        border-radius: 4px
      }
    }
  }
</style>
