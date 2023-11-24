<script setup>
import eventbus from '@/eventbus/index';
import IconEdit from '@/components/Icons/IconEdit.vue';
import IconRemove from '@/components/Icons/IconRemove.vue';
import { useScenariosStore } from '@/store/ScenariosDataStore';

const props = defineProps({
  index: { type: Number },
  scenario: { type: Object },
});

const scenariosStore = useScenariosStore();
</script>

<template>
  <div
    class="b-scenarios_item_desc d-flex justify-content-center align-items-center"
  >
    <span>{{ props.index + 1 }}</span> Сценарий {{ props.index + 1 }}
  </div>
  <div
    class="b-scenarios_item_actions d-flex justify-content-center align-items-center"
  >
    <button
      class="edit-btn"
      @click="eventbus.emit('update-scenario', scenario)"
    >
      <IconEdit />
    </button>
    <button class="remove-btn" @click="scenariosStore.removeScenario(index)">
      <IconRemove />
    </button>
  </div>
</template>

<style scoped lang="scss">
.b-scenarios_item {
  &_desc {
    font-size: 16px;
    font-weight: 500;
    color: $color-dark-gray;
    gap: 10px;
    span {
      height: 2rem;
      border-radius: 32px;
      padding: 0 0.6rem;
      border: 1.2px solid $color-zeus;
      background: $color-sweet-corn;
      text-align: center;
      line-height: 1.8rem;
      font-weight: 400;
      font-size: 12px;
    }
  }

  &_actions {
    gap: 1.8rem;
  }

  .edit-btn {
    height: 3rem;
  }

  .remove-btn {
    height: 1.4rem;
    line-height: 1.4rem;
  }

  .edit-btn,
  .remove-btn {
    cursor: pointer;
    svg {
      color: $color-grey;
      fill: $color-grey;
      transition: all 0.3s;
    }

    &:hover svg {
      color: $color-dark-red;
      fill: $color-dark-red;
    }
  }
}
</style>
