import { defineStore } from 'pinia';
import { ref } from 'vue';

const SCENARIOS_STORAGE_KEY = 'scenarios';

export const useScenariosStore = defineStore(SCENARIOS_STORAGE_KEY, {
  // state is the data being stored in the data store
  state: () => ({
    scenarios: ref(
      localStorage.getItem(SCENARIOS_STORAGE_KEY)
        ? JSON.parse(localStorage.getItem(SCENARIOS_STORAGE_KEY))
        : []
    ),
    selectedNumbers: ref([]),
    checkedNumbers: ref([]),
  }),

  // getters return data from the data store
  getters: {},

  // actions are operations that change the state
  actions: {
    addScenario(scenario) {
      this.scenarios.push(scenario);

      localStorage.setItem(
        SCENARIOS_STORAGE_KEY,
        JSON.stringify(this.scenarios)
      );
    },
    removeScenario(i) {
      this.scenarios.splice(i, 1);

      localStorage.setItem(
        SCENARIOS_STORAGE_KEY,
        JSON.stringify(this.scenarios)
      );
    },
    updateScenario(updatedScenario) {
      const scenario = this.scenarios.find((scenario) => {
        return scenario.id === updatedScenario.id;
      });

      if (scenario) {
        scenario.value = updatedScenario.value;
      }

      localStorage.setItem(
        SCENARIOS_STORAGE_KEY,
        JSON.stringify(this.scenarios)
      );
    },
  },
});
