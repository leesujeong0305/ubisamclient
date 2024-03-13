import { combineReducers, createStore } from 'redux';
import authReducer from './Reducer';
import userInfoReducer from './UserInfoReducer';
const rootReducer = combineReducers({ //변수가 여러개일때는 combineReducers로 한번에 가져올수 있음
    auth: authReducer, // `auth` 리듀서는 인증 관련 상태를 관리
    // 다른 리듀서들이 있다면 여기에 추가
    info: userInfoReducer
  });
  
  // 루트 리듀서를 사용하여 스토어 생성
const store = createStore(rootReducer);
export default store;