<template>
  <div v-if="modelValue" class="modal">
    <h3>User modal</h3>

    <button @click="close">Close</button>
    <button @click="save">Save</button>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

const save = () => {
  // xử lý logic save...
  emit('update:modelValue', false)
}
</script>
