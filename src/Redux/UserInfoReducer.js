// const initialState = {
//     authUserId : "",
//     authUserName : "",
//     authUserRank : "",
// };

// export default function userInfoReducer(state = initialState, action) {
    
    
//     switch (action.type) {
        
//         case 'UPDATE_USER_INFO':
//             return { ...state, authUserId:action.payload.email, authUserName:action.payload.name, authUserRank:action.payload.rank };

//         case 'DELETE_USER_INFO':
//             return { ...state, authUserId:"", authUserName:"", authUserRank:"" };

//         default:
//             return state;
//     }
    
// };