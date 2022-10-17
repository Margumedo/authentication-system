import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { Navigate, useNavigate } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);
	let navigate = useNavigate();


	useEffect(() => {
		if (store.token != "") {
			actions.handleUSer();
			return;
		}
		navigate('/login');

	}, [store.token])

	return (
		<div className="container">
			<div className="row">
				{store.token.length > 0 ? (

					<>
						<h1 className="text-center my-5">Bienvenido a mi app de prueba</h1>
						<ul>
							{store.users.map((user, index) => {
								return (
									<li key={user.id}>
										<span>Usuario {index + 1}: </span>{user.email}
									</li>
								)
							})}
						</ul>
					</>
				)
					: (<h1 className="text-center my-5">Usted no tiene permiso</h1>)
				}
			</div>
		</div>

	);
};
