<script setup>
import eventbus from '@/eventbus/index';
import IconLogo from '@/components/Icons/IconLogo.vue';
import IconEdit from '@/components/Icons/IconEdit.vue';
import IconRemove from '@/components/Icons/IconRemove.vue';
import { useScenariosStore } from '@/store/ScenariosDataStore';

const scenariosStore = useScenariosStore();
</script>

<template>
  <div class="b-scenarios d-flex flex-column align-items-center">
    <IconLogo />

    <TransitionGroup
      name="list"
      tag="div"
      class="d-flex b-scenarios_wrap flex-column"
    >
      <template
        v-if="scenariosStore.scenarios && scenariosStore.scenarios.length"
      >
        <div
          class="b-scenarios_item d-flex justify-content-center align-items-center justify-content-space-between"
          v-for="(scenario, i) in scenariosStore.scenarios"
          :key="i"
        >
          <div
            class="b-scenarios_item_desc d-flex justify-content-center align-items-center"
          >
            <span class="">{{ i + 1 }}</span> Сценарий {{ i + 1 }}
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
            <button
              class="remove-btn"
              @click="scenariosStore.removeScenario(i)"
            >
              <IconRemove />
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <p>Сценариев еще нет</p>
      </template>
    </TransitionGroup>

    <button
      class="open-modal-btn"
      type="button"
      @click="eventbus.emit('open-modal')"
    >
      Создать сценарий
    </button>
  </div>
</template>

<style scoped lang="scss">
.b-scenarios {
  width: 39.6rem;
  padding: 4.6rem 4.8rem;
  gap: 3.2rem;
  height: fit-content;
  background: $color-white;
  border-radius: 0.8rem;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.08),
    0px 1px 2px 0px rgba(0, 0, 0, 0.05);
  @media (max-width: 480px) {
    padding: 4.6rem 3.2rem;
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
      color: #808080;
      fill: #808080;
      transition: all 0.3s;
    }

    &:hover svg {
      color: #c71b2a;
      fill: #c71b2a;
    }
  }
  .open-modal-btn {
    width: 100%;
    padding: 0.6rem 1.6rem;
    justify-content: center;
    align-items: center;
    border-radius: 0.4rem;
    background-color: #fcd000;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.16);
    font-size: 1.4rem;
    font-weight: 600;
  }

  p {
    color: #666666;
    font-size: 1.4rem;
    text-align: center;
    transition: all 0.7s;
  }

  &_wrap {
    width: 100%;
    gap: 1.2rem;
  }

  &_item {
    transition: all 0.7s;
    width: 100%;
    padding: 0.9rem 2rem;
    background-color: #fcf8ef;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
    border-radius: 0.4rem;
    &_desc {
      font-size: 16px;
      font-weight: 500;
      color: #666;
      gap: 10px;
      span {
        height: 2rem;
        border-radius: 32px;
        padding: 0 0.6rem;
        border: 1.2px solid #3e3f3a;
        background: #ffe87c;
        text-align: center;
        line-height: 1.8rem;
        font-weight: 400;
        font-size: 12px;
      }
    }

    &_actions {
      gap: 2rem;
    }
  }
}

.list-leave-to {
  opacity: 0;
  height: 0;
  visibility: hidden;
  display: none;
}

.list-leave-from {
  opacity: 1;
  height: 0;
  visibility: hidden;
  transition: all 0.7s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  height: 0;
  visibility: hidden;
  transition: all 0.7s ease;
}
</style>
