var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('TODO API root');
});

// GET /todos
app.get('/todos', function(req, res) {
	var query = req.query;
	var filteredTodos = todos;

	var where = {};


	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && _.isString(query.q) && query.q.trim().length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		}
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();
	});
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var toDoId = parseInt(req.params.id, 10);

	db.todo.findById(toDoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(e) {
		res.status(500).send();
	});
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	body.description = body.description.trim();

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var toDoId = parseInt(req.params.id, 10);
	var deleteToDo = _.findWhere(todos, {
		id: toDoId
	});

	if (deleteToDo) {
		todos = _.without(todos, deleteToDo);
		res.json(deleteToDo);
	} else {
		res.status(404).json({
			"error": "object was not found"
		});
	}
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var toDoId = parseInt(req.params.id, 10);
	var updateToDo = _.findWhere(todos, {
		id: toDoId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!updateToDo) {
		return res.status(404).json({
			"error": "object was not found"
		});
	}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(updateToDo, validAttributes);
	res.json(updateToDo);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on Port: ' + PORT + '!');
	});
});