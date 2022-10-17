const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			token: localStorage.getItem("token") || "",
			users: [],
		},
		actions: {											// las funciones en los actions se declaran como objetos
			userRegister : async (user)=>{					// recibo user porque es el objeto que se esta tratando de registrar en el inicio
				try {
					let response = await fetch(`http://127.0.0.1:3001/api/user/`,{            // hago un fetch a mi api
						method: "POST",
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(user),	  								    // en el cuerpo de la solicitud le paso el objeto que contine los datos a registrar (email, password)
					});	
					if (response.ok){
						return true;
					} 
					return false; 

				} catch (error) {
					console.log(`Error:${error}`);
				}
			},
			
			userLogin: async(user)=>{
				try {
					let response = await fetch(`http://127.0.0.1:3001/api/login/`,{
						method: 'POST',
						headers: {
							'Content-Type':'application/json',	
					},
					body: JSON.stringify(user),
			 	});
				if (response.ok){
					let data = await response.json();
					setStore({token: data.token})				      // guardo en el store el data.token porque data es un objeto que trae token 
					window.localStorage.setItem("token", data.token)
					console.log(data);
					return true;
				}else{
					console.log('Todo mal con esto');
					return false;
				}
					
				} catch (error) {	
					console.log(`Error: ${error}`)
				}
			},

			logout: ()=>{
				localStorage.removeItem('token');  						//elimino a el token de localstorage
				setStore({token: ""});								   //configuro el token con vacio
			},

			handleUSer : async () => {
				let store= getStore();
				try {
					let response = await fetch("http://127.0.0.1:3001/api/user/", {
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${store.token}`
						}
					});
					if (response.ok) {
						let data = await response.json();
						setStore({users: data});
						console.log("desde el useEffect");
					}
		
				} catch (error) {
					console.log("Error:" + error)
				}
			},

		}	
	};
};

export default getState;
