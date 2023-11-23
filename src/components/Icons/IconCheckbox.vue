<script setup>
const props = defineProps({
  variant: { type: String, default: 'unchecked' },
});
</script>

<template>
  <svg
    v-if="variant === 'unchecked'"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M0.5 3C0.5 1.61929 1.61929 0.5 3 0.5H13C14.3807 0.5 15.5 1.61929 15.5 3V13C15.5 14.3807 14.3807 15.5 13 15.5H3C1.61929 15.5 0.5 14.3807 0.5 13V3Z"
      fill="#F2F2F2"
      stroke="#CCCCCC"
    />
  </svg>
  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0 3C0 1.34315 1.34315 0 3 0H13C14.6569 0 16 1.34315 16 3V13C16 14.6569 14.6569 16 13 16H3C1.34315 16 0 14.6569 0 13V3Z"
      fill="#0B7CFF"
    />
    <path
      d="M12.9049 3.55566L6.58864 9.83175L3.98179 7.25036L2.6665 8.55861L6.59096 12.4446L14.2221 4.86207L12.9049 3.55566Z"
      fill="white"
    />
  </svg>
</template>
