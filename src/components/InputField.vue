<script setup lang="ts">
defineProps<{
  labelText?: string;
  type: string;
  placeholder?: string;
  name: string;
  classes?: string;
  modelValue?: string;
}>();
defineEmits(["update:modelValue"]);
</script>

<template>
  <div :class="classes">
    <label :for="name" v-show="labelText">{{ labelText }}</label>
    <input
      class="uk-input uk-margin-small-top"
      :type="type || 'text'"
      :name="name"
      :placeholder="placeholder"
      :value="modelValue"
      @input="($event) => $emit('update:modelValue', $event.target?.value)"
    />
  </div>
</template>
