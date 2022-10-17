import React, { useContext, useState } from "react";            // importo react, useState y useContext desde la libreria react 
import { Context } from "../store/appContext";                  // importo context desde mi appContext
import { useNavigate } from "react-router-dom"

const Login = () => {

    //Naviagate
    let navigate = useNavigate();

    // estado inicial para mi hook
    let initialState = {
        email: "",
        password: "",
    }

    const [userLogin, setUserLogin] = useState(initialState);           // declaro mi hook

    //necesito capturar lo que se escribe en los inputs

    const handleChange = (event) => {                     // defino mi funcion que me va a ayudar a capturar lo que se escriba
        setUserLogin({                                    // uso sethook para modificar el hook en base a lo que se escriba 
            ...userLogin,                                 // aplico un spread operator al hook haciendo una copia de lo que se tenga
            [event.target.name]: event.target.value       // capturo lo que se esta escribendo
        })
    }

    const { actions } = useContext(Context)               // hago una destructuracion de mi context y extraigo actions

    //necesito manejar el submit
    const handleSubmit = async (event) => {

        event.preventDefault();                            // con event.preventDefault evito que ocurra el burbujeo en mi pagina al darle submit    
        if (userLogin.email.trim() != "" && userLogin.password.trim() != "") {     // valido si se escribio algo en los inputs
            console.log("Debo enviar la info");
            let response = await actions.userLogin(userLogin);
            if (response) {
                navigate("/")
            } else {
                alert("algo salio mal mi pana")
            }
        } else {
            alert("Todos los campos son requeridos mi pana");
        }
    }


    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <h1 className="text-center">Ingresa</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group my-3">
                            <label>Email:</label>
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                onChange={handleChange}
                                value={userLogin.email}             //se le coloca value igual al hook para que esten sincronizados
                            />
                        </div>

                        <div className="form-group my-3">
                            <label>Password:</label>
                            <input
                                type="text"
                                name="password"
                                className="form-control"
                                onChange={handleChange}
                                value={userLogin.password}          //se le coloca value igual al hook para que esten sincronizados
                            />
                        </div>

                        <button className="btn btn-success w-100 my-3">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;