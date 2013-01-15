(function() {

	var international = i18n(dictionary),
		t8 = international.map


	/*$('.nav-collapse a').each(function(index, link) {

	 $(link).text(function(index, text) {

	 return t8(text)
	 })
	 })*/


	var Task = Backbone.Model.extend({
		defaults: {
			"created": "2013-01-01T12:00",
			"credits": 0,
			"difficulty": 0.5,
			"displayedHints": 0,
			"given": ["", ""],
			"hints": null,
			"id": 0,
			"note": "HPI, Mathematik I - Diskrete Strukturen und Logik, Wintersemester 2012/2013",
			"setting": "",
			"solutions": ["", ""],
			"specifications": "",
			"status": "unapproved",
			"subject": "",
			"tags": null,
			"task": "Do this:",
		},
		initialize: function() {
		}
	})


	var TasksCollection = Backbone.Collection.extend({
		model: Task,
		url: 'js/tasks.json',
		parse: function(response) {
			return response.tasks
		}
	})


	var TasksListView = Backbone.View.extend({
		tagName: 'ul',
		className: 'nav nav-list',
		initialize: function() {
		},
		render: function() {

			this.$el.empty()


			//console.log(this.collection)

			_.each(this.collection, function(task) {

				this.$el.append(new TasksListItemView({model: task}).render().el);

			}, this)

			return this
		}
	})

	var TasksListItemView = Backbone.View.extend({
		tagName: "li",
		events: {
			'click .taskLink': function() {

			}
		},
		initialize: function() {
		},
		render: function() {

			var check = '',
				id = this.model.get('id')

			if(!_.compact(this.model.get('solutions')).length)
				check = 'muted'

			var showExercise = function(el) {

				$(el).on('click', function() {

					var task = appRouter.tasksList.get(id),
						taskView = new TaskView({model: task})

					$('#content')
						.html(taskView.render().el)
						.fadeIn('fast')

				})
			}

			DOMinate(
				[this.el,
					['a.exerciseLink',
						{id: '#exerciseLink' + id},
						['small', String(id) + '. Aufgabe',
							{class: check}
						],
						showExercise
					]
				]
			)

			return this
		}

	})

	var TaskView = Backbone.View.extend({
		template: _.template("<div class=\"tabbable span9\">\n\t<ul class=\"nav nav-tabs\">\n\t\t<li class=\"active\">\n\t\t\t<a href=\"#tab1\">Task</a>\n\t\t</li>\n\t\t<li class=\"disabled\"><a>Edit</a></li>\n\t\t<li class=\"disabled\"><a>History</a></li>\n\t</ul>\n\n\t<div class=\"tab-content\">\n\t\t<div id=\"tab1\" class=\"tab-pane active\">\n\t\t\t\n\t\t\t<% if(status == \'incorrect\'){ %>\n\t\t\t\t<div class=\"alert alert-error\"><strong>Attention!</strong> There are mistakes in this exercise! Please help to correct them!</div>\n\t\t\t<% } %>\n\t\t\t\n\t\t\t<h4><%= task %></h4>\n\t\t\t\n\t\t\t<hr>\n\n\t\t\t<p><%= setting %></p>\n\t\t\t\n\t\t\t<hr>\n\n\t\t\t<p><%= _.reduce(given, function(a,b){ return a + \'</p><p>\' + b }) %></p>\n\t\t\t\n\t\t\t<div id=\"hints\"></div>\n\n\t\t\t<div class=\"accordion\">\n\t\t\t\t<div class=\"accordion-group\">\n\t\t\t\t\t<div class=\"accordion-heading\">\n\n\t\t\t\t\t\t<a href=\"#collapseOne\" class=\"btn btn-success accordion-toggle\" data-toggle=\"collapse\">Solution</a>\n\t\t\t\t\t\t<!--<a class=\"accordion-toggle\" data-toggle=\"collapse\"  href=\"#collapseOne\">\n\t\t\t\t\t\t\tSolution\n\t\t\t\t\t\t</a>-->\n\t\t\t\t\t</div>\n\t\t\t\t\t<div id=\"collapseOne\" class=\"accordion-body collapse out\">\n\t\t\t\t\t\t<div class=\"accordion-inner\">\n\t\t\t\t\t\t\t<p><%= _.reduce(solutions, function(a,b){ return a + \'</p><p>\' + b }) %></p>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\n\t\t</div>\n\t</div>\n\n</div>\n<div class=\"container span3\">\t\n</div>\n"),
		events: {
			"click #showHint": "showHint"
		},
		initialize: function() {
			this.model.on('reset', this.render, this)
		},
		render: function() {
			this
				.renderTask()
				.renderBar()


			MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el])

			return this
		},
		renderBar: function() {
			this.$('.span3')
				.html(new TaskBarView({model: this.model}).render().el)
				.fadeIn()

			return this
		},
		renderTask: function() {
			this.$el
				.html(this.template(this.model.toJSON()))
				.fadeIn()

			return this
		},
		showHint: function() {
			var counter = this.model.get('displayedHints')

			if(counter < this.model.get('hints').length) {

				var el = $('<div class="alert alert-info">' + this.model.get('hints')[counter] + '</div>')

				this.$('#hints')
					.hide()
					.append(el)
					.fadeIn('fast')

				MathJax.Hub.Queue(["Typeset", MathJax.Hub, el[0]])

				counter++
				this.model.set('displayedHints', counter)
			}

			this.renderBar()
		}
	});


	var TaskBarView = Backbone.View.extend({
		tagName: 'ul',
		className: 'nav nav-list',
		template: _.template($('#exerciseSideBarTemplate').html()),
		render: function() {
			this.$el.html(this.template(this.model.toJSON()))

			this.$("[rel=tooltip]").tooltip();

			return this
		}
	})


	var AppView = Backbone.View.extend({
		render: function() {

		}
	})


	var AppRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			":subject": "list",
		},
		initialize: function() {
			this.tasksList = new TasksCollection()

			this.route(/^(\d+)$/, "taskDetails")
		},

		list: function(subject) {

			var tasksListView

			this.tasksList.fetch({
				success: function(collection) {

					tasksListView = new TasksListView(
						{'collection': collection.where({subject: subject})}
					)

					$('#sidebar')
						.html(tasksListView.render().el)
						.fadeIn('fast')
				}
			})

			$('#banner').hide()
			$('#tasks').show()
		},

		taskDetails: function(id) {

			console.log(id)

			if(this.tasksList.length) {

				this.task = this.tasksList.get(id)

				this.taskView = new TaskView({model: this.task})

				$('#content')
					.html(this.taskView.render().el)
					.fadeIn('fast')

			} else {

				this.list()
				this.tasksList.once('reset', function() {
					this.taskDetails(id)
				}, this)
			}

		},

		home: function() {
			$('#banner').show()
			$('#tasks').hide()
		},

		defaultRoute: function() {

		}

	});

	var appRouter = new AppRouter()

	Backbone.history.start({
		root: "localhost/~adrian/educatopia"
	})


	//Activate Tooltips

	/*
	 hyperdoc.table('#table2a', [
	 ['`a`', '`b`', '`c`', '`a vv b`', '`a vv not c`', '`b ^^ not c`', '`(a vv b) ^^ (a vv not c)`', '`(a vv b) ^^ (a vv not c) => (b ^^ not c)`'],
	 [0, 0, 0, 0, 1, 0, 0, 1],
	 [0, 0, 1, 0, 0, 0, 0, 1],
	 [0, 1, 0, 1, 1, 1, 1, 1],
	 [0, 1, 1, 1, 0, 0, 0, 1],
	 [1, 0, 0, 1, 1, 0, 1, 0],
	 [1, 0, 1, 1, 1, 0, 1, 0],
	 [1, 1, 0, 1, 1, 1, 1, 1],
	 [1, 1, 1, 1, 1, 0, 1, 0]
	 ])

	 hyperdoc.table('#table2b', [
	 ['`a`', '`b`', '`c`', '`a => b`', '`not b => not a`', '`b ^^ not c`', '`(a => b) ^^ (not b => not a)`', '`(a => b) ^^ (not b => not a) iff (b ^^ not c)`'],
	 [0, 0, 0, 1, 1, 0, 1, 0],
	 [0, 0, 1, 1, 1, 0, 1, 0],
	 [0, 1, 0, 1, 1, 1, 1, 1],
	 [0, 1, 1, 1, 1, 0, 1, 0],
	 [1, 0, 0, 0, 0, 0, 0, 1],
	 [1, 0, 1, 0, 0, 0, 0, 1],
	 [1, 1, 0, 1, 1, 1, 1, 1],
	 [1, 1, 1, 1, 1, 0, 1, 0]
	 ])
	 */


	//console.log(international.getUntranslated())

}())
