/* eslint-disable promise/param-names */

const state = {
    user_id: null,
};

const getters = {};

const actions = {};

const mutations = {
    SET_USER_ID(state, {user_id}) {
        state.user_id = user_id;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
