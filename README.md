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
* [Flask-socketio](https://flask-socketio.readthedocs.io), gives Flask applications access to bi-directional communications between the clients and the server and provides all functionnalities of SocketIO
* various other Flask plugins
* [SQLAlchemy](http://www.sqlalchemy.org/), a Python SQL toolkit and ORM that gives application developers the full power and flexibility of SQL
* [MariaDB](https://mariadb.org/), a fast, scalable and robust database, with a rich ecosystem of storage engines, plugins and many other tools
 
On the frontend, we are using :

* [Angular2](https://angular.io/), a framework by Google
* [Bootstrap4](https://getbootstrap.com), a very well known css framework


## Deployment

Requirements:
* node 6 LTS (tested on 6.9.1), other versions might work but were not tested
* npm version 3+

Other requirements will come once the backend is implemented (mainly python 3.5+)

Here are the steps you need to perform to deploy the project locally:

1. Clone the repo : `git clone git@github.com:BenjaminSchubert/web-polls`
2. cd into the frontend : `cd web-polls/frontend`
3. install dependencies : `npm install` (you can also use `yarn`)
4. launch the server: `npm run watch`.
5. the application will be available at `localhost:8080`

Please note that this is a work in progress and is not feature complete yet.


## About the developpers
Made by [Benjamin Schubert](https://github.com/BenjaminSchubert) and [Basile Vu](https://github.com/Flagoul).
