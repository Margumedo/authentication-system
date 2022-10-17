import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {

	const{store, actions}=useContext(Context)

	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="mx-3">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
			</div>

			<div className="container justify-content-end">
				<div className="ml-auto">
					<Link to="/register">
						<button className="btn btn-info mx-2">Registrarse</button>
					</Link>
				</div>

				<div className="ml-auto">
					<Link to="/login">
						<button className="btn btn-info mx-4">Ingresar</button>
					</Link>
				</div>
				<div className="ml-auto">
					
					<button className="btn btn-info mx-2 " onClick={()=>actions.logout()} >Salir</button>
					
				</div>
			</div>
		</nav>
	);
};
