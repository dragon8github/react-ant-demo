import { 
	searchOgpWarningCallUser,
	saveOgpWarningCallUser,
	removeOgpWarningCallUser,
	getOgpWarningCallUser, 
} from '../../services/riskApi';

export default {
  namespace: 'ogpWarningCallUser',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    domain: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(searchOgpWarningCallUser, payload);
      yield put({
        type: 'updateList',
        payload: response,
      });
    },
    *loadDomain({ payload, callback }, { call, put }) {
      const response = yield call(getOgpWarningCallUser, payload);
      yield put({
        type: 'updateDomain',
        payload: response,
      });
      if (callback) callback(response);
    },
    *clearDomain({ payload }, { put }) {
      yield put({
        type: 'updateDomain',
        payload: { ...payload, code: 200 },
      });
    },
    *save({ payload, callback }, { call }) {
      const response = yield call(saveOgpWarningCallUser, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeOgpWarningCallUser, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    updateList(state, action) {
      const resp = action.payload;
      const result = {
        list: resp.rows,
        pagination: {
          total: resp.total,
        },
      };
      return {
        ...state,
        data: result,
      };
    },
    updateDomain(state, action) {
      const resp = action.payload;
      return {
        ...state,
        domain: resp,
      };
    },
  },
};
