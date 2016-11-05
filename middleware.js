module.exports = function(db) {
	return {
		requireAuthentication: function(req, res, next) {
			var token = req.get('Auth');
			console.log(token);

			db.user.findByToken(token).then(function(user) {
				console.log(user);
				req.user = user;
				next();
			}, function(e) {
				res.status(401).send();
			});
		}
	};
}