<script setup>
import { ref, watch, onMounted } from 'vue';
import eventbus from '@/eventbus/index';
import IconChoose from '@/components/Icons/IconChoose.vue';
import IconCheckbox from '@/components/Icons/IconCheckbox.vue';
import IconRemove from '@/components/Icons/IconRemove.vue';
import RangeSlider from '@/components/RangeSlider.vue';
import users from '../../data.json';
import { useScenariosStore } from '@/store/ScenariosDataStore';

const isSelectOpened = ref(false);

const scenariosStore = useScenariosStore();

const isChecked = (name) => {
  return scenariosStore.checkedNumbers.includes(name);
};

const toggleSelectNumbers = () => {
  scenariosStore.selectedUsers.value = users.filter((user) => {
    return scenariosStore.checkedNumbers.includes(user.number);
  });

  isSelectOpened.value = !isSelectOpened.value;
};

const selectAllNumbers = () => {
  users.forEach((user) => {
    const userNumber = user.number;

    if (!scenariosStore.checkedNumbers.includes(userNumber)) {
      scenariosStore.checkedNumbers.push(userNumber);
    }
  });
};

const clearAllNumbers = () => {
  scenariosStore.checkedNumbers = [];
};

const removeNumber = (i) => {
  scenariosStore.selectedUsers.value.splice(i, 1);
  scenariosStore.checkedNumbers.splice(i, 1);
};

onMounted(() => {
  eventbus.on('close-select', () => {
    isSelectOpened.value = false;
  });
});
</script>

<template>
  <div class="select-numbers d-flex flex-column">
    <div class="select-numbers_wrap">
      <label>Звонить</label>

      <div
        class="select-numbers_title"
        :class="{ 'is-active': isSelectOpened }"
        @click="toggleSelectNumbers"
      >
        <template v-if="scenariosStore.checkedNumbers.length">
          <template
            v-for="(number, i) in scenariosStore.checkedNumbers"
            :key="i"
          >
            <span>{{ number }}</span>
            <template v-if="i !== scenariosStore.checkedNumbers.length - 1">{{
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
                v-model="scenariosStore.checkedNumbers"
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
          v-if="
            scenariosStore.selectedUsers.value &&
            scenariosStore.selectedUsers.value.length
          "
          class="rings-sliders d-flex flex-column"
        >
          <div
            v-for="(user, i) of scenariosStore.selectedUsers.value"
            class="d-flex align-items-center"
            :key="i"
          >
            <RangeSlider :user="user" />

            <button class="remove-btn" @click="removeNumber(i)">
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
</template>

<style lang="scss" scoped>
.select-numbers {
  position: relative;
  padding: 0 2.6rem;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 60%;
  margin-bottom: auto;
  overflow-y: auto;
  &_actions {
    margin-bottom: 1rem;
    button {
      color: $color-dark-red;
      font-size: 1.4rem;
    }
  }

  &_title {
    width: 100%;
    border-radius: 0.4rem;
    padding: 0.4rem 1.6rem 0.3rem 1rem;
    border: 1px solid $color-albescent-white;
    color: $color-pale-oyster;
    font-size: 1.4rem;
    cursor: pointer;
    span {
      color: $color-dark-charcoal;
    }

    &.is-active {
      outline: 2px solid $color-energy-yellow;
    }
  }

  &_wrap {
    position: relative;
    label {
      font-size: 1.4rem;
      font-weight: 600;
    }
  }

  &_content {
    position: absolute;
    top: 5.6rem;
    width: 100%;
    padding: 1.6rem 1.6rem 0 1.6rem;
    background-color: $color-white;
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
      color: $color-dark-charcoal;
    }

    &_number {
      color: $color-grey;
    }

    &:last-child label {
      padding-bottom: 1.2rem;
    }
  }
}

.rings {
  margin-top: 3.2rem;
  padding-bottom: 2rem;
  &-scale {
    background-color: $color-china-ivory;
    border-bottom: 2px solid $color-albescent-white;
    padding: 0.6rem 1.2rem 0.6rem 1.2rem;
    color: $color-grey;
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
      color: $color-dark-red;
      font-size: 1.4rem;
      font-weight: 600;
      line-height: 2rem;
      &:after {
        content: '';
        position: absolute;
        bottom: 0.2rem;
        left: 0;
        right: 0;
        border-top: 1px dashed $color-dark-red;
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
          color: $color-grey;
          fill: $color-grey;
          transition: all 0.3s;
        }
        &:hover svg {
          color: $color-fire-engine-red;
          fill: $color-fire-engine-red;
        }
      }
    }
  }
}
</style>
