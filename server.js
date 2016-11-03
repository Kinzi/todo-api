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
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var toDoId = parseInt(req.params.id, 10);
	
	var matchedToDo = _.findWhere(todos, {id: toDoId});

	if(matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');

	body.description = body.description.trim();

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0 ) {
		return res.status(404).send();
	}

	body.id = todoNextId++;
	todos.push(body);

	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var toDoId = parseInt(req.params.id, 10);
	var deleteToDo = _.findWhere(todos, {id: toDoId});

	if(deleteToDo) {
		todos = _.without(todos, deleteToDo);
		res.json(deleteToDo);
	} else {
		res.status(404).json({"error":"object was not found"});
	}
});


app.listen(PORT, function() {
	console.log('Express listening on Port: ' + PORT + '!');
});
