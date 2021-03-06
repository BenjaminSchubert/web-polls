# web-polls

A webapp to create polls and invite people to them.

This application was made in the context of the TWEB course at HEIG-VD. This application allows
an user to create polls, invite people to them and ask questions. Each participant can vote and see the
result for a question at any time.

Our landing page can be found [there](https://benjaminschubert.github.io/web-polls/).

You can try the app deployed [here](https://polls.benschubert.me/).

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

1. `docker-compose up --build db` to launch the db. You will need to have a `.env` file as described in the `Deployment` section.
2. Activate your virtual environment if you have created one.
3. `pip install -r backend/requirements.pip` to install the requirements for the backend
4. You will need to set these environment variables before running the server:
```
WEBPOLLS_DB_ENGINE="mysql"
WEBPOLLS_SECRET_KEY=${WEBPOLLS_SECRET_KEY}
WEBPOLLS_DB_NAME=${MYSQL_DATABASE}
WEBPOLLS_DB_HOST=${HOST}
WEBPOLLS_DB_USER=${MYSQL_USER}
WEBPOLLS_DB_PASSWORD=${MYSQL_PASSWORD}
```
In the line above, replace the variables such as `${MYSQL_DATABASE}` by the values you want. You may want to set values that match
the ones defined in the `.env` file. What you could do is run `set -a && source .env && set +a` then export each one of the
`WEBPOLLS_*` env variables (by running `export WEBPOLLS_DB_NAME=${MYSQL_DATABASE}`, for example) and they will be set directy.

If you sourced the `.env` file, the only variable you can't simply export is `WEBPOLLS_DB_HOST`. The `HOST` variable is set to `db`;
that's an alias that is used between the other dockers. Here, to know the value to set for `WEBPOLLS_DB_HOST`, you will need to go
inside the docker of mariaDB currently running and get its IP address. You can do the following: 
`the docker inspect db | grep IPAddress` and the IP address will be on the second line of the results displayed.

An example of a typical setup would include these variables before launching the server:
```
WEBPOLLS_SECRET_KEY=12345
WEBPOLLS_DB_ENGINE=mysql
WEBPOLLS_DB_NAME=webpolls
WEBPOLLS_DB_HOST=172.18.0.2
WEBPOLLS_DB_USER=webpolls
WEBPOLLS_DB_PASSWORD=insecure
```

After that, you will be able to run the server using `python backend/runserver.py` and work on the backend. If you don't want to 
set these variables everytime you want to start the server, you may want to set them up inside your IDE or make a script that export
the values.

To setup the frontend, here is what you must do:

1. `cd frontend`
2. `npm install` and then `npm run watch`
3. The app is running on `http://localhost:8080`. Of course, if you run the server anywhere else than directly on your machine (on a VM for example), don't forget to replace `localhost` by the appropriate address. 
4. You are ready to develop. If you change a file in the frontend, it will rebuild the project.


## About the developpers
Made by [Benjamin Schubert](https://github.com/BenjaminSchubert) and [Basile Vu](https://github.com/Flagoul).
