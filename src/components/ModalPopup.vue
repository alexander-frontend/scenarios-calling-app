<script setup>
import { defineProps, ref, defineExpose } from 'vue';

const props = defineProps({
  message: { type: Object },
  cancel: { type: Boolean },
});

const isOpen = ref(false);
const resolveCallback = ref(null);
const rejectCallback = ref(null);

const openModal = () => {
  isOpen.value = true;

  return new Promise((resolve, reject) => {
    resolveCallback.value = resolve;
    rejectCallback.value = reject;
  });
};

const confirmAction = () => {
  isOpen.value = false;

  resolveCallback.value();
};

const cancelAction = () => {
  isOpen.value = false;

  rejectCallback.value();
};

const closeModal = () => {
  isOpen.value = false;
};

defineExpose({
  openModal,
});
</script>

<template>
  <div class="modal" @click="closeModal" v-if="isOpen">
    <div class="modal-content d-flex flex-column">
      <p>{{ props.message.title }}</p>
      <p>{{ props.message.description }}</p>
      <div class="modal-actions">
        <button class="btn btn-yes" @click="confirmAction">
          Выйти без сохранения
        </button>
        <button v-if="cancel" class="btn btn-no" @click="cancelAction">
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 3.2rem 2.4rem;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  box-shadow: 0px 2px 40px rgba(0, 0, 0, 0.25);
}

.modal-content {
  background-color: $color-white;
  padding: 3.6rem 3.4rem;
  border-radius: 0.3rem;
  gap: 2rem;
  color: $color-medium-dark-cyan-blue;
  text-align: left;
}

.modal-content p:first-child {
  font-size: 2rem;
}

.modal-content p:last-child {
  font-size: 1.4rem;
}

.modal-actions {
  margin-top: 0.2rem;
}

.btn {
  border-radius: 0.3rem;
  padding: 0.6rem 1.6rem;
  cursor: pointer;
  font-size: 1.4rem;
  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
}

.btn-yes {
  background-color: $color-fire-engine-red;
  color: $color-white;
  margin-right: 1rem;
  text-transform: uppercase;
  font-weight: 500;
}

.btn-no {
  color: $color-dark-red;
}
</style>
