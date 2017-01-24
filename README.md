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
6. the application will be available at `localhost:8080`. Of course, if you run the dockers anywhere else than directly on your machine (on a VM for example), don't forget to replace `localhost` by the appropriate address. 


## About the developpers
Made by [Benjamin Schubert](https://github.com/BenjaminSchubert) and [Basile Vu](https://github.com/Flagoul).
