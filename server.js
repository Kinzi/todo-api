var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	var queryParams = req.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {
			completed: true
		});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {
			completed: false
		});
	}

	if (queryParams.hasOwnProperty('q') && _.isString(queryParams.q) && queryParams.q.trim().length > 0) {
		filteredTodos = _.filter(filteredTodos, function(todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var toDoId = parseInt(req.params.id, 10);

	var matchedToDo = _.findWhere(todos, {
		id: toDoId
	});

	if (matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	body.description = body.description.trim();

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0) {
		return res.status(404).send();
	}

	body.id = todoNextId++;
	todos.push(body);

	res.json(body);
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


app.listen(PORT, function() {
	console.log('Express listening on Port: ' + PORT + '!');
});