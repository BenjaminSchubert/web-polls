# web-polls

A webapp to create polls and invite people to them.

This application was made in the context of the TWEB course at HEIG-VD. This application allows
an user to create polls, invite people to them and ask questions. Each participant can vote and see the
result for a question at any time.

Our landing page can be found [there](https://benjaminschubert.github.io/web-polls/).

You can see a preview of the app on our [wiki](https://github.com/BenjaminSchubert/web-polls/wiki/Preview-of-the-app).

## Frameworks used
On the backend we are using :

* [Flask](http://flask.pocoo.org/), a lightweight python server framework
* [Flask-websockets](https://github.com/zeekay/flask-uwsgi-websocket), an efficient websocket implementation for Flask
* [Flask-socketio](https://flask-socketio.readthedocs.io), a plugin providing all functionnalities of SocketIO
* various other Flask plugins
* [SQLAlchemy](http://www.sqlalchemy.org/), a Python SQL toolkit and ORM that gives application developers the full power and flexibility of SQL
* [MariaDB](https://mariadb.org/), a fast, scalable and robust database, with a rich ecosystem of storage engines, plugins and many other tools
 
On the frontend, we are using :

* [Angular2](https://angular.io/), a framework by Google
* [Bootstrap4](https://getbootstrap.com), a very well known css framework


## Deployment

Requirements:
* Docker 1.13.0
* Docker Compose 1.10.0

Here are the steps you need to perform to deploy the project locally:

1. Clone the repo : `git clone git@github.com:BenjaminSchubert/web-polls`
2. cd into the project : `cd web-polls`
3. There is a file name `.env.sample`. Copy it to a new `.env` file: `cp .env.sample .env`
4. Open the .env file and set the various environment variables to the value you want.
5. Launch the dockers: `docker-compose up --build`
6. the application will be available on `http://localhost:8080`. Of course, if you run the dockers anywhere else than directly on your machine (on a VM for example), don't forget to replace `localhost` by the appropriate address. 


## Contributing

If you want to contribute to the project or simply modify it, you will find here the steps to setupthe development environment.

Requirements:
* node 6 LTS (tested on 6.9.1), other versions might work but were not tested
* npm version 3+
* python 3.5
* Docker 1.13.0
* Docker-compose 1.10.0

It is strongly advised that you setup a [virtualenv](https://virtualenv.pypa.io) before anything. If you dont' want to, be careful about 
which python version you use and be ready to install python packages globally.

In this section, we will use npm alongside flask and only the DB running in a docker. Here are the steps you need to do:

1. `docker-compose up --build db` to lauch the db.
2. Activate your virtual environment if you have created one.
3. `pip install -r backend/requirements.pip` to install the requirements for the backend
4. Export theses variables using the commands below:
```
export WEBPOLLS_DB_ENGINE="mysql"
export WEBPOLLS_DB_NAME=${MYSQL_DATABASE}
export WEBPOLLS_DB_HOST=${HOST}
export WEBPOLLS_DB_USER=${MYSQL_USER}
export WEBPOLLS_DB_PASSWORD=${MYSQL_PASSWORD}
```
Replace ${MYSQL_DATABASE} by the mysql password you have set in you .env (the one mentionned in the `Deployment` section, and do the
same for the other variables. If you don't mind having the variables defined in the .env to be set directly, you can execute 
`set -a && source .env && set +a` to load them and the you can run the commands above directly.

After that, you will be able to run the server using `python backend/runserver.py` and work on the backend.
To setup the frontend, here is what you must do:

1. `cd frontend`
2. `npm install` and then `npm run watch`
3. The app is running on `http://localhost:8080`. Of course, if you run the server anywhere else than directly on your machine (on a VM for example), don't forget to replace `localhost` by the appropriate address. 
4. You are ready to develop. If you change a file in the frontend, it will rebuild the project.


## About the developpers
Made by [Benjamin Schubert](https://github.com/BenjaminSchubert) and [Basile Vu](https://github.com/Flagoul).
