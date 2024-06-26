// const initialState = {
//     isAuthenticated: false,
//     isAdmin: false,
// };

// export default function authReducer(state = initialState, action) {
    

//     switch (action.type) {
//         case 'LOGIN':
//             return { ...state, isAuthenticated: true, isAdmin: false };
//         case 'ADMIN_LOGIN':
//             return { ...state, isAuthenticated: true, isAdmin: true };
//         case 'LOGOUT':
//             return { ...initialState };
//         case 'LOGING':
//             if (action.accessToken)
//                 return { ...state, isAuthenticated: true, isAdmin: false };
//             else
//                 return { ...state, isAuthenticated: true, isAdmin: false };
//         default:
//             return state;
//     }
// }