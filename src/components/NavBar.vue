<script setup>
import { ref, onMounted } from 'vue';
import users from '../../data.json';
import eventbus from '@/eventbus/index';
import IconChoose from '@/components/Icons/IconChoose.vue';
import IconClose from '@/components/Icons/IconClose.vue';
import IconCheckbox from '@/components/Icons/IconCheckbox.vue';
import IconRemove from '@/components/Icons/IconRemove.vue';
import RangeSlider from '@/components/RangeSlider.vue';
import { useScenariosStore } from '@/store/ScenariosDataStore';

const isMenuOpened = ref(false);
const checkedNumbers = ref([]);
const isSelectOpened = ref(false);
const selectedUsers = ref([]);

const scenariosStore = useScenariosStore();

const editingScenarioId = ref(null);

const isChecked = (name) => {
  return checkedNumbers.value.includes(name);
};

const selectAllNumbers = () => {
  users.forEach((user) => {
    const userNumber = user.number;

    if (!checkedNumbers.value.includes(userNumber)) {
      checkedNumbers.value.push(userNumber);
    }
  });

  selectedUsers.value.value = users
    .filter((user) => {
      return checkedNumbers.value.includes(user.number);
    })
    .sort((a, b) => a.number - b.number);

  selectedUsers.value.value.forEach((user) => {
    if (!user.min && !user.max) {
      user.min = 0;
      user.max = 120;
    }
  });
};

const clearAllNumbers = () => {
  checkedNumbers.value = [];
};

const closeMenu = () => {
  isSelectOpened.value = isMenuOpened.value = false;

  setTimeout(() => {
    selectedUsers.value = [];
    checkedNumbers.value = [];
  }, 500);

  editingScenarioId.value = null;
};

const toggleSelectNumbers = () => {
  selectedUsers.value.value = users
    .filter((user) => {
      return checkedNumbers.value.includes(user.number);
    })
    .sort((a, b) => a.number - b.number);

  selectedUsers.value.value.forEach((user) => {
    if (!user.min && !user.max) {
      user.min = 0;
      user.max = 120;
    }
  });

  isSelectOpened.value = !isSelectOpened.value;
};

const addScenario = () => {
  const newScenario = {
    id: window.crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
    value: selectedUsers.value.value,
  };

  scenariosStore.addScenario(newScenario);
  closeMenu();
};

const updateScenario = () => {
  if (editingScenarioId.value === selectedUsers.value.id) {
    const editedScenario = {
      id: selectedUsers.value.id,
      value: selectedUsers.value,
    };

    scenariosStore.updateScenario(editedScenario);

    editingScenarioId.value = null;
    closeMenu();
  }
};

const removeUser = (i) => {
  selectedUsers.value.value.splice(i, 1);
  checkedNumbers.value.splice(i, 1);
};

const triggerCheckbox = () => {
  selectedUsers.value.value = users.filter((user) => {
    return checkedNumbers.value.includes(user.number);
  });
};

onMounted(() => {
  eventbus.on('open-modal', () => {
    isMenuOpened.value = true;
  });

  eventbus.on('update-scenario', (scenario) => {
    isMenuOpened.value = true;

    editingScenarioId.value = scenario.id;

    selectedUsers.value = scenario;
    checkedNumbers.value = [];

    selectedUsers.value.value.forEach((user) => {
      checkedNumbers.value.push(user.number);
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
    class="nav-bar d-flex flex-column justify-content-space-between"
    :class="{ opened: isMenuOpened == true }"
  >
    <div class="nav-bar_top">
      <button class="close-btn" @click="closeMenu">
        <IconClose />
      </button>

      <p class="nav-bar_top_desc">Создать сценарий</p>

      <div class="select-numbers d-flex flex-column">
        <label>Звонить</label>

        <div
          class="select-numbers_title"
          :class="{ 'is-active': isSelectOpened }"
          @click="toggleSelectNumbers"
        >
          <template v-if="checkedNumbers.length">
            <template v-for="(number, i) in checkedNumbers" :key="i">
              <span>{{ number }}</span>
              <template v-if="i !== checkedNumbers.length - 1">{{
                ', '
              }}</template>
            </template>
          </template>
          <template v-else> Выберите внутренние номера </template>
        </div>

        <div v-if="isSelectOpened" class="select-numbers_content z-index-4">
          <div
            class="select-numbers_actions d-flex justify-content-space-between"
          >
            <button @click="selectAllNumbers">Выбрать все</button>
            <button @click="clearAllNumbers">Очистить</button>
          </div>

          <div class="select-numbers_items">
            <div v-for="user in users" class="select-numbers_item">
              <label class="d-flex" :for="user.number">
                <IconCheckbox
                  :variant="isChecked(user.number) ? 'checked' : 'unchecked'"
                />

                <span class="select-numbers_item_name">{{ user.name }}</span>
                <span class="select-numbers_item_number"
                  >({{ user.number }})</span
                >

                <input
                  type="checkbox"
                  :id="user.number"
                  :value="user.number"
                  v-model="checkedNumbers"
                  @change="triggerCheckbox($event)"
                />
              </label>
            </div>
          </div>
        </div>

        <div class="rings">
          <div class="rings-scale d-flex justify-content-space-between">
            <span>0 сек</span>
            <span>120 сек</span>
          </div>

          <div
            v-if="selectedUsers.value && selectedUsers.value.length"
            class="rings-sliders d-flex flex-column"
          >
            <div
              v-for="(user, i) of selectedUsers.value"
              class="d-flex align-items-center"
              :key="i"
            >
              <RangeSlider :user="user" />

              <button class="remove-btn" @click="removeUser(i)">
                <IconRemove />
              </button>
            </div>
          </div>

          <div
            v-else
            class="rings-choose d-flex justify-content-center align-items-center flex-column"
          >
            <IconChoose />
            <p class="rings-choose_desc">Внутренних номеров не добавлено</p>
            <button class="choose-btn" @click="isSelectOpened = true">
              Выбрать
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="nav-bar_footer d-flex">
      <button
        @click="addScenario"
        class="create-btn"
        :disabled="checkedNumbers.length == 0"
        v-if="editingScenarioId !== selectedUsers.id"
      >
        Создать
      </button>
      <button
        :disabled="checkedNumbers.length == 0"
        @click="updateScenario"
        class="update-btn"
        v-else
      >
        Сохранить
      </button>
      <button class="cancel-btn" @click="closeMenu">Отменить</button>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.overlay {
  position: absolute;
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
.nav-bar {
  width: 50rem;
  position: absolute;
  top: 0;
  bottom: 0;
  right: -50rem;
  height: 100vh;
  overflow: hidden;
  background: #fff;
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

  label {
    margin-bottom: 0.2rem;
    font-size: 1.4rem;
    font-weight: 600;
  }

  .select-numbers {
    position: relative;
    &_actions {
      margin-bottom: 1rem;
      button {
        color: #900;
        font-size: 1.4rem;
      }
    }

    &_title {
      width: 100%;
      border-radius: 0.4rem;
      padding: 0.4rem 1.6rem 0.3rem 1rem;
      border: 1px solid #dfd7ca;
      color: #9f917a;
      font-size: 1.4rem;
      cursor: pointer;
      span {
        color: #333;
      }

      &.is-active {
        outline: 2px solid #fddd45;
      }
    }

    &_content {
      position: absolute;
      top: 5.6rem;
      width: 100%;
      padding: 1.6rem 1.6rem 0 1.6rem;
      background-color: #fff;
      box-shadow: 0px 1px 5px 0px rgba(24, 19, 11, 0.18);
    }

    &_item {
      line-height: 1.8rem;
      label {
        gap: 0.8rem;
        padding-top: 0.7rem;
        padding-bottom: 1.3rem;
        font-weight: 400;
        cursor: pointer;
      }

      input {
        position: absolute;
        opacity: 0;
        height: 0;
        width: 0;
      }

      &_name {
        color: #333;
      }

      &_number {
        color: #808080;
      }

      &:last-child label {
        padding-bottom: 1.2rem;
      }
    }
  }

  &_top {
    padding: 2.6rem 2.2rem 0 2.6rem;
    @media (max-width: 480px) {
      padding: 3rem 2rem;
    }
    .rings {
      margin-top: 3.2rem;
      &-scale {
        background-color: #fff7d1;
        border-bottom: 2px solid #dfd7ca;
        padding: 0.6rem 1.2rem 0.6rem 1.2rem;
        color: #808080;
        font-size: 1.4rem;
        font-weight: 500;
      }

      &-choose {
        gap: 0.8rem;
        padding-top: 5.8rem;
        &_desc {
          font-size: 1.4rem;
        }
        .choose-btn {
          position: relative;
          color: #900;
          font-size: 1.4rem;
          font-weight: 600;
          line-height: 2rem;
          &:after {
            content: '';
            position: absolute;
            bottom: 0.2rem;
            left: 0;
            right: 0;
            border-top: 1px dashed #900;
          }
        }
      }

      &-sliders {
        margin-top: 2.8rem;
        gap: 5.7rem;
        > div {
          gap: 1rem;
          .remove-btn {
            height: 1.4rem;
            line-height: 1.4rem;
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
        }
      }
    }

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
      background-color: #fcd000;
      text-transform: uppercase;
      font-size: 1.4rem;
      font-weight: 500;
      &:disabled,
      &[disabled] {
        background-color: #e2e2e2;
      }
    }

    .cancel-btn {
      color: #900;
      font-size: 1.4rem;
    }
  }
}
</style>
