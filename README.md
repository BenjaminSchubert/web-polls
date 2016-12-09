# web-polls

A webapp to create polls and invite people to them.

This application was made in the context of the TWEB course at HEIG-VD. This application allows
an user to create polls, invite people to them and ask questions. Each participant can vote and see the
result for a question at any time.

Our landing page can be found [there](https://benjaminschubert.github.io/web-polls/).

## Preview of the app

Let's do a quick tour of the app by using a simple scenario of a user creating polls and another user answering to a question created.

First, let's suppose the future admin of the room has previously created an account and is logged in. Now, he wants to create a room in which he can create polls to ask questions. What he sees is the following:
![alt tag](https://github.com/BenjaminSchubert/web-polls/blob/gh-pages/assets/img/no-room-selected.png)
Note: in our case, the user had already joined other rooms before.

By clicking on the "+" button, he can then create a new room (in our case, TWEB-2016):
![alt tag](https://github.com/BenjaminSchubert/web-polls/blob/gh-pages/assets/img/room-creation.png)

Now, the room is created and the room index is displayed to him. An invitation link can be copied (used to invite other people) and the description of the room edited. As he is in a room (and also the admin), another "+" button appears, which allows him to create polls.
![alt tag](https://github.com/BenjaminSchubert/web-polls/blob/gh-pages/assets/img/room-index.png)

Finally, the user creates a question in the poll. He can specify the title of the question, the type (can there be only 1 answer or multiples?) and, of course, the possible choices.
![alt tag](https://github.com/BenjaminSchubert/web-polls/blob/gh-pages/assets/img/question-creation.png)
Note: here, the user has created some other polls before that point. Some are open (green round indicator) and other are closed (grey indicator).

Now let's look at what another user that joined the room sees when he answers the question. Here, we have the question created by the admin and its choices and the user checks what he wants.
![alt tag](https://github.com/BenjaminSchubert/web-polls/blob/gh-pages/assets/img/question-multiple.png)

After that, he submits his answer and a graph appears, displaying the results for this question and updating in real time.
![alt tag](https://github.com/BenjaminSchubert/web-polls/blob/gh-pages/assets/img/question-results.png)

Afterward, even if the poll is closed, he can still navigate on the questions that were asked and see the results.

## Frameworks used
On the backend we are using :

* [Flask](http://flask.pocoo.org/), a lightweight python server framework
* [Flask-websockets](https://github.com/zeekay/flask-uwsgi-websocket), an efficient websocket implementation for Flask
* various other Flask plugins
 
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
