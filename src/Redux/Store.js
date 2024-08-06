//import { combineReducers, configureStore } from 'redux';
// import authReducer from './Reducer';
// import userInfoReducer from './UserInfoReducer';
// const rootReducer = combineReducers({ //변수가 여러개일때는 combineReducers로 한번에 가져올수 있음
//     auth: authReducer, // `auth` 리듀서는 인증 관련 상태를 관리
//     // 다른 리듀서들이 있다면 여기에 추가
//     info: userInfoReducer
//   });
  
//   // 루트 리듀서를 사용하여 스토어 생성
// const store = createStore(rootReducer);
// export default store;

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';


// auth 슬라이스 생성
const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    isLoggedIn: false,
    isAdmin: false,
  },
  reducers: {
    login(state) {
      state.isLoggedIn = true;
      state.isAdmin = false;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.isAdmin = false;
    }
  }
});

const userInfInit = {
  authUserId : "",
  authUserName : "",
  authUserRank : "",
  authUserTeam : "",
  authManager : "",
};

// userInfo 슬라이스 생성
const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState : {
    authUserId : "",
    authUserName : "",
    authUserRank : "",
    authUserTeam : "",
    authManager : "",
  },
  reducers: {
    resetUser(state) {
      return userInfInit; // 상태를 초기화
    },
    updateUser(state, action) {
      if (action !== undefined) {
        state.authUserId = action.payload.id;
        state.authUserName = action.payload.name;
        state.authUserRank = action.payload.rank;
        state.authUserTeam = action.payload.department;
        state.authManager = action.payload.manager;
      } else {
        state.authUserId = "";
        state.authUserName = "";
        state.authUserRank = "";
        state.authUserTeam = "";
        state.authManager = "";
      }
      
    }
  }
});

// 스토어 구성
const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    userInfo: userInfoSlice.reducer
  }
});

// 액션 익스포트
export const { login, logout } = authSlice.actions;
export const { resetUser, updateUser } = userInfoSlice.actions;

// 스토어 익스포트
export default store;
