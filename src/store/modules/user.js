/* eslint-disable no-shadow */
const state = {
  token: null,
};

const actions = {
  setToken({ commit }, token) {
    commit('SET_TOKEN', token);
  },
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
