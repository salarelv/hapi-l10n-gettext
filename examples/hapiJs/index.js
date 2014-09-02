var path = require('path');
var Hapi = require('hapi');
var Joi = require('joi');

var server = new Hapi.Server('0.0.0.0', process.env.PORT || 8080, {
	views: {
		engines: {
			html: require('handlebars')
		},
		path: path.join(__dirname, 'views/templates'),
		partialsPath: path.join(__dirname, 'views/partials')
	}
});

server.route({
	path: '/public/{path*}',
	method: 'GET',
	handler: {
		directory: {
			path: './public',
			listing: false,
			index: false
		}
	}
});

server.route({
	method: 'GET',
	path: '/',
	handler: function (request, reply) {
		reply.view('index', {title: server.methods.gettext("Log in")});
	}
});
server.route({
	method: 'GET',
	path: '/locale/{_locale}',
	config: {
		validate: {
			params: {
				_locale: Joi.string().required()
			}
		}
	},
	handler: function (request, reply) {
		reply.redirect(request.info.referrer);
	}
});

server.pack.register([{
	plugin: require('good')
}, {
	plugin: require('../../').hapiJsPlugin,
	options: {
		cookieName: '_locale',
		l10nDirectory: path.join(__dirname, '/../shared/locales'),
		defaultLocale: 'en'
	}
}], function (err) {
	if (err) throw err;
	server.start(function () {
		server.log('info', 'Server running at: ' + server.info.uri);
	});
});
