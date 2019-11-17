
export default function UserReducer(state, action){
	switch (action.type) {
		case 'ADD_USER' :
			console.log('i am here to add user');
			console.log(state);
			return true;

		default:
			return (state ? state : null);
	}
};
