<script setup>
import { ref, onMounted } from 'vue';
import users from '../../data.json';
import eventbus from '@/eventbus/index';
import IconClose from '@/components/Icons/IconClose.vue';
import IconSuccess from '@/components/Icons/IconSuccess.vue';
import SelectNumbers from '@/components/SelectNumbers.vue';
import { useScenariosStore } from '@/store/ScenariosDataStore';

const isMenuOpened = ref(false);

const scenariosStore = useScenariosStore();

const editingScenarioId = ref(null);

const scenarioAddShow = ref(false);

const closeMenu = () => {
  isMenuOpened.value = false;

  eventbus.emit('close-select');

  setTimeout(() => {
    scenariosStore.selectedUsers = [];
    scenariosStore.checkedNumbers = [];
  }, 500);

  editingScenarioId.value = null;
};

const addScenario = () => {
  scenariosStore.selectedUsers.value = users
    .filter((user) => {
      return scenariosStore.checkedNumbers.includes(user.number);
    })
    .sort((a, b) => a.number - b.number);

  const newScenario = {
    id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
    value: scenariosStore.selectedUsers.value,
  };

  scenariosStore.addScenario(newScenario);

  closeMenu();

  scenarioAddShow.value = !scenarioAddShow.value;

  setTimeout(() => {
    scenarioAddShow.value = !scenarioAddShow.value;
  }, 3000);
};

const updateScenario = () => {
  if (editingScenarioId.value === scenariosStore.selectedUsers.id) {
    const editedScenario = {
      id: scenariosStore.selectedUsers.id,
      value: scenariosStore.selectedUsers.value,
    };

    scenariosStore.updateScenario(editedScenario);

    editingScenarioId.value = null;

    closeMenu();
  }
};

const openMenu = () => {
  isMenuOpened.value = true;
};

onMounted(() => {
  eventbus.on('open-modal', () => {
    openMenu();
  });

  eventbus.on('update-scenario', (scenario) => {
    openMenu();

    editingScenarioId.value = scenario.id;

    scenariosStore.selectedUsers = JSON.parse(JSON.stringify(scenario));
    scenariosStore.checkedNumbers = [];

    scenariosStore.selectedUsers.value.forEach((user) => {
      scenariosStore.checkedNumbers.push(user.number);
    });
  });
});
</script>

<template>
  <div
    class="overlay"
    :class="{ opened: isMenuOpened == true }"
    @click="closeMenu"
  ></div>
  <section
    class="nav-bar d-flex flex-column"
    :class="{ opened: isMenuOpened == true }"
  >
    <div class="d-flex nav-bar_wrap flex-column justify-content-space-between">
      <div class="nav-bar_title">
        <button class="close-btn" @click="closeMenu">
          <IconClose />
        </button>

        <p class="nav-bar_wrap_desc">
          <template v-if="editingScenarioId"> Редактировать сценарий </template>
          <template v-else> Создать сценарий </template>
        </p>
      </div>

      <SelectNumbers />

      <div class="nav-bar_footer d-flex">
        <button
          @click="addScenario"
          class="create-btn"
          :disabled="scenariosStore.checkedNumbers.length == 0"
          v-if="editingScenarioId !== scenariosStore.selectedUsers.id"
        >
          Создать
        </button>
        <button
          :disabled="scenariosStore.checkedNumbers.length == 0"
          @click="updateScenario"
          class="update-btn"
          v-else
        >
          Сохранить
        </button>
        <button class="cancel-btn" @click="closeMenu">Отменить</button>
      </div>
    </div>
  </section>

  <Transition class="scenario-add-show" name="fade-slide" appear>
    <div v-show="scenarioAddShow">
      <IconSuccess />
      <div>Сценарий добавлен</div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  background: rgba(0, 0, 0, 0.35);
  transition: all 0.8s;
  &.opened {
    opacity: 1;
    visibility: visible;
    transition: all 0.8s;
  }
}

.scenario-add-show {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  width: 302px;
  padding: 18px 16px;
  align-items: center;
  gap: 10px;
  border-radius: 0.4rem;
  border: 1px solid $color-jet-stream;
  background-color: $color-white-ice;
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: $color-green;
}

.nav-bar {
  width: 50rem;
  position: fixed;
  top: 0;
  bottom: 0;
  right: -50rem;
  height: 100vh;
  overflow: hidden;
  background: $color-white;
  opacity: 0;
  transition: all 0.5s ease-out;
  &.opened {
    width: 50rem;
    opacity: 1;
    right: 0;
    transition: all 0.5s ease-out;
    @media (max-width: 480px) {
      width: 100%;
    }
  }

  &_title {
    padding: 2.6rem 2.6rem 0 2.6rem;
    label {
      margin-bottom: 0.2rem;
      font-size: 1.4rem;
      font-weight: 600;
    }
  }

  &_wrap {
    height: 100%;
    &_desc {
      margin-bottom: 2.1rem;
      font-size: 2rem;
    }

    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }

  &_footer {
    padding: 2rem 2.6rem;
    border-top: 1px solid rgba(0, 0, 0, 0.16);
    gap: 2rem;
    .create-btn,
    .update-btn {
      padding: 0.6rem 1.4rem;
      border-radius: 0.3rem;
      background-color: $color-tangerine-yellow;
      text-transform: uppercase;
      font-size: 1.4rem;
      font-weight: 500;
      &:disabled,
      &[disabled] {
        background-color: $color-gainsboro;
      }
    }

    .cancel-btn {
      color: $color-dark-red;
      font-size: 1.4rem;
    }
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 2s ease, transform 1s ease-in-out;
  transform: translateY(0px);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
