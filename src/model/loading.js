import { effects } from "redux-saga";
import { goloading } from "../server"; //登录
// import { getUserInfo } from "../server"; //获取用户信息
export default {
  namespace: "load",
  state: {},
  reducers: {
    getToken(state, { payload }) {
      let newState = { ...state };
      newState.token = payload;
      //console.log(newState);
      return newState;
    }
    // getUsername(state, { payload }) {
    //   let newState = { ...state };
    //   newState.userInfo = payload;
    //   //console.log(newState);
    //   return newState;
    // }
  },
  effects: {
    *goload({ payload }, { call, put }) {
      let { student_id, student_pwd, history } = payload;
      try {
        let dataToken = yield call(goloading, { student_id, student_pwd });
        // console.log(data);
        if (dataToken.code === 0) {
          //登录失败
          if (dataToken.msg.message) {
            alert(dataToken.msg.message);
            alert(dataToken.msg.errors[0].message);
          } else {
            alert(dataToken.msg);
          }
        } else {
          //登录成功
          document.cookie = "token=" + dataToken.token;
          yield put({
            type: "getToken",
            payload: dataToken.token
          });
          alert(dataToken.msg);
          // try {
          //   let dataUserInfo = yield call(getUserInfo);
          //   //console.log(dataUserInfo);
          //   if (dataUserInfo.code === 1) {
          //     yield put({
          //       type: "getUsername",
          //       payload: {
          //         ...dataUserInfo.data[0]
          //       }
          //     });
          //   } else {
          //     alert(dataUserInfo.msg);
          //   }
          // } catch (err) {
          //   alert(err);
          // }
          history.push("/test");
        }
      } catch (err) {
        alert(err);
      }
    }
  }
};
