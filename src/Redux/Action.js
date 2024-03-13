// 액션 타입 정의
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const ADMIN_LOGIN = 'ADMIN_LOGIN';
export const DELETE_USER_INFO = 'DELETE_USER_INFO';

// 인증 관련 액션 생성자
export const loginSuccess = (userData) => {
  return {
    type: LOGIN_SUCCESS,
    payload: userData,
  };
};
export const login = () => {
    return {
        type: LOGIN,
    }
};

export const logout = () => {
  return {
    type: LOGOUT,
  };
};

// 사용자 정보 업데이트 액션 생성자
export const updateUserInfo = (newUserInfo) => {
  return {
    type: UPDATE_USER_INFO,
    payload: newUserInfo,
  };
};

export const deleteUserInfo = () => {
  return {
    type: DELETE_USER_INFO,
  }
}