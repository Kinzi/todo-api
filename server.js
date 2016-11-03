var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
		id: 1,
		description: 'Tel with mum',
		completed: false
	},{
		id: 2,
		description: 'Eat well',
		completed: false
	},{
		id: 3,
		description: 'Sleep well',
		completed: true
	}
];

app.get('/', function(req, res) {
	res.send('TODO API root');
});

app.get('/todos', function(req, res) {
	res.json(todos);
});

app.get('/todos/:id', function(req, res) {
	var toDoId = parseInt(req.params.id, 10);
	var matchedToDo;

	todos.forEach(function(todo) {
		if(todo.id === toDoId) {
			matchedToDo = todo;
		}
	});

	if(matchedToDo) {
		res.json(matchedToDo);
	} else {
		res.status(404).send();
	}
	// res.send(todos[req.params.id - 1]);
});

app.listen(PORT, function() {
	console.log('Express listening on Port: ' + PORT + '!');
});
