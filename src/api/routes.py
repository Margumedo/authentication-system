"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os      
from shutil import ExecError
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException

from werkzeug.security import generate_password_hash, check_password_hash      # importo generate y cheack de la libreria werkzeug.security
from base64 import b64encode                                                   # importo b64encode desde la libreria base64
from flask_jwt_extended import create_access_token, JWTManager, jwt_required

api = Blueprint('api', __name__)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

def set_password(password, salt):                                  # Declaro una funcion que me recibe mi contrase;a y el salt
    return generate_password_hash(f"{password}{salt}")             # y me devuelve la contrase;a contatenado con el salt y hasheada 

def check_password(hash_password, password, salt):                   # Declaro una funcion que recibe mi contrase;a hasheada y mi contrase;a sin hashear
    return check_password_hash(hash_password, f"{password}{salt}")   # y me dice si las contrase;a coinciden

############ Creando la ruta para registrar usuarios##########

@api.route('/user', methods=['POST'])           # creo mi ruta para user
def add_user():                                 # declaro mi funcion para agregar el usuario
    if request.method == 'POST':                # pregunto si el metodo es POST
        body = request.json                     # guardo el cuerpo de la solicitud en la variable body
        email = body.get('email', None)         # declaro una variable email, y guardo el emial en ella y en caso de no conseguirla la creo en None    
        password = body.get('password', None)   # declaro una variable password, y guardo la contraseña en ella y en caso de no conseguirla la creo en None
        name = body.get('name', None)           # declaro una variable name, y guarde el nombre de usuario y en caso de no conseguirla la creo en None
       
                                                # hacemos las Validaciones
        if email is None or password is None:               # verifico si existe una propiedad email 
            print ('debe enviar el payload completo'), 400  # en caso de dar error imprimo el mensaje y paso el codigo (400 Bad Request)
        else:
            salt = b64encode(os.urandom(32)).decode('utf-8')                       # creo el salt en base a b64code aleatorio
            password = set_password(password, salt)                                      # antes de registrar el usuario, hasheo mi contrase;a 
            print (f"debo guardar al usuario con el pass: ${password}"), 200       # imprimo el mensaje y paso el codigo 200 (Ok)
            request_user = User(name = name, email=email, password=password, salt=salt)   # Instancio mi variable request_user
            db.session.add(request_user)                                            # inicio la session en BD con los datos de usuario
            
            try:                                    # realizo un try except            
                db.session.commit()                 # subo los cambios en BD
                return jsonify("Todo bien"), 200    # retorno un mensaje "Todo bien" con el codigo 200(ok)
            except ExecError as error:
                db.session.rollback                 # en caso de error, regreso todos los cambios
                print(error.args)
                return jsonify('algo salio mal')
    return jsonify(), 201                           # retorno vacio con el codigo 201 (Created)

##########Creando la ruta para consultar todos los usuaruios##########

@api.route('/user' , methods = ['GET'])
@jwt_required()
def allUser():
    if request.method == 'GET':
        all_user = User.query.all()
        return jsonify(list(map(lambda user: user.serialize(), all_user))),200
    
    return jsonify(),405

######### Creando la ruta para hacer Login##########

@api.route('/login', methods=['POST'])              # declaro mi ruta para el hacer login con un metodo POST
def login():                                        # defino mi funcion llamada login
    if request.method == 'POST':                    # verifico si el metodo a implementar es POST
        body = request.json                         # en caso de serlo, guardo lo que me envian en la variable body
        email = body.get('email', None)             # declaro mi variable email y guardo el email del usuario que intenta logearse alli
        password = body.get('password', None)       # declaro mi variable password y guardo la contrase;a de quien intenta logearse alli
    
        login_user = User.query.filter_by(email=email).one_or_none()       # hago una consulta a la BD y me traigo el usuario que corresponda al emial y usuario
        if login_user:                                           # en caso de exisitir el usuario      
            if check_password(login_user.password, password, login_user.salt):    # verifico si la contrase;a que me pasaron coincide con el hash
                print("este pana tiene permiso")                 # imprimo un mensaje que se tiene permiso
                ###CREAR Y RESPONDER EL TOKEN###   
                created_token = create_access_token(identity= login_user.id)
                return jsonify({'token': created_token}), 200        # y retorno un mensaje usted esta logeado con el codigo 200 ok
            else:
                return jsonify("Bad credentials"),    400        # en caso de no coincidir retorno un mensaje de error con el codigo 400 (Bad reques)
        else:                                                    # en caso de no traer nada
            return jsonify('bad credencial'), 400                # respondo con mensaje de error y con el codigo 400(Bad request)
    return jsonify('Metodo no permitido'),405   
