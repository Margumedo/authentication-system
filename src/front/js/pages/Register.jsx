import React, { useState, useContext } from "react";     //importo react, useState desde la libreria react para usar mi hook y usecontext para usar el contexto
import { Context } from "../store/appContext";            // importo el Context desde mi appContext

const Register = () => {

    let initialState = {            // declaro una variable que sera mi objeto inical que usa el hook  
        email: "",
        password: "",
    }

    const [userRegister, setUserRegister] = useState(initialState)      // declaro mi hook y su estado inicial sera un objeto (que contiene email, nombre, password)

    const handleChange = (event) => {                         // declaro una funcion que recibe un arrow funtion
        setUserRegister({                                    // modifico el hook con lo siguiente
            ...userRegister,                                 // le aplico un spread operator a lo que tenga en el hook
            [event.target.name]: event.target.value,         // le asigno el valor que se escriba a la llave del hook que corresponda
        })
    }

    const { actions } = useContext(Context);                // realizo la destructuracion de mi context

    const handleSubmit = async (event) => {                  // declaro una funcion que me va ayudar a manejar el submit
        event.preventDefault();                             // y con la funcion preventDefault evito el burbujeo en mi pagina

        if (userRegister.email.trim() != "" && userRegister.password.trim() != "") {    // valido si email o password son campos vacioas
            console.log("procedo a registrar")
            let response = await actions.userRegister(userRegister);
            if (response) {
                alert("Se registro usuario con exito")
                setUserRegister({ initialState });
            } else {
                alert("Algo salio mal")
            }
        } else {
            console.log("todos los campos deben ser validos mi pana")
        }

    }


    return (

        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-md-6">
                    <h1 className="text-center">Registrate</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group my-3">
                            <label>Email:</label>
                            <input
                                type="text"
                                name="email"
                                className="form-control"
                                onChange={handleChange}         // por medio del atributo Onchange invoco la funcion handleChange
                                value={userRegister.email}
                            />
                        </div>

                        <div className="form-group my-3">
                            <label>Password:</label>
                            <input
                                type="text"
                                name="password"
                                className="form-control"
                                onChange={handleChange}
                                value={userRegister.password}
                            />
                        </div>

                        <button className="btn btn-primary w-100 my-3" >Registrarse</button>
                    </form>
                </div>
            </div>
        </div >
    );
};

export default Register;