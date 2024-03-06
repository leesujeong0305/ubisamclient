import { combineReducers, createStore } from 'redux';
import authReducer from './Reducer';
const rootReducer = combineReducers({ //변수가 여러개일때는 combineReducers로 한번에 가져올수 있음
    auth: authReducer, // `auth` 리듀서는 인증 관련 상태를 관리
    // 다른 리듀서들이 있다면 여기에 추가
  });
  
  const store = createStore(rootReducer);
export default store;