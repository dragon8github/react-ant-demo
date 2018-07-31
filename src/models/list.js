import { queryFakeList } from '../services/api';

const myqueryFakeList = async() => {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
        const response = [{"id": "fake-list-0", "owner": "付小小", "title": "本原", "avatar": "//avatar.zbjimg.com/013/26/23/200x200_avatar_93.jpg!big", "cover": "https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png", "status": "active", "percent": 87, "logo": "//avatar.zbjimg.com/013/26/23/200x200_avatar_93.jpg!big", "href": "https://ant.design", "updatedAt": "2018-07-31T01:30:57.391Z", "createdAt": "2018-07-31T01:30:57.391Z", "subDescription": "那是一种内在的东西， 他们到达不了，也无法触及的", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 157788, "newUser": 1960, "star": 153, "like": 199, "message": 12, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{"avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜"}] },
        {"id": "fake-list-1", "owner": "曲丽丽", "title": "金墨", "avatar": "//avatar.zbjimg.com/014/15/12/200x200_avatar_38.jpg!big", "cover": "https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png", "status": "exception", "percent": 86, "logo": "//avatar.zbjimg.com/014/15/12/200x200_avatar_38.jpg!big", "href": "https://ant.design", "updatedAt": "2018-07-30T23:30:57.391Z", "createdAt": "2018-07-30T23:30:57.391Z", "subDescription": "希望是一个好东西，也许是最好的，好东西是不会消亡的", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 157709, "newUser": 1679, "star": 115, "like": 115, "message": 16, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{"avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜"}] },
        {"id": "fake-list-2", "owner": "林东东", "title": "凡狼", "avatar": "//avatar.zbjimg.com/016/51/54/200x200_avatar_22.jpg!big", "cover": "https://gw.alipayobjects.com/zos/rmsportal/uVZonEtjWwmUZPBQfycs.png", "status": "normal", "percent": 80, "logo": "//avatar.zbjimg.com/016/51/54/200x200_avatar_22.jpg!big", "href": "https://ant.design", "updatedAt": "2018-07-30T21:30:57.391Z", "createdAt": "2018-07-30T21:30:57.391Z", "subDescription": "生命就像一盒巧克力，结果往往出人意料", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 172790, "newUser": 1380, "star": 192, "like": 103, "message": 20, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{"avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜"}] },
        {"id": "fake-list-3", "owner": "周星星", "title": "全能", "avatar": "//avatar.zbjimg.com/018/83/53/200x200_avatar_17.jpg!big", "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png", "status": "active", "percent": 94, "logo": "//avatar.zbjimg.com/018/83/53/200x200_avatar_17.jpg!big", "href": "https://ant.design", "updatedAt": "2018-07-30T19:30:57.391Z", "createdAt": "2018-07-30T19:30:57.391Z", "subDescription": "城镇中有那么多的酒馆，她却偏偏走进了我的酒馆", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 165220, "newUser": 1721, "star": 160, "like": 168, "message": 16, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{"avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜"}] },
        {"id": "fake-list-4", "owner": "吴加好", "title": "匠派", "avatar": "//avatar.zbjimg.com/011/65/62/200x200_avatar_26.jpg!big", "cover": "https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png", "status": "exception", "percent": 55, "logo": "//avatar.zbjimg.com/011/65/62/200x200_avatar_26.jpg!big", "href": "https://ant.design", "updatedAt": "2018-07-30T17:30:57.391Z", "createdAt": "2018-07-30T17:30:57.391Z", "subDescription": "那时候我只会想自己想要什么，从不想自己拥有什么", "description": "在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。", "activeUser": 159001, "newUser": 1994, "star": 190, "like": 125, "message": 17, "content": "段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。", "members": [{"avatar": "https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png", "name": "曲丽丽"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png", "name": "王昭君"}, {"avatar": "https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png", "name": "董娜娜"}] }]
        resolve(response);
    }, 1500);
 })
}

export default {
  namespace: 'list',

  state: {
    list: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(myqueryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    appendList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
