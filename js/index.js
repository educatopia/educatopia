(function() {

	var appRouter,
		AppRouter,
		ExerciseFormView,
		AppView,
		TaskBarView,
		TaskView,
		TasksListItemView,
		TasksListView,
		Task,
		TasksCollection,
		international = i18n(dictionary),
		t8 = international.map,
		auto,
		specified,
		rootExercise,
		ExerciseForm,
		exerciseFormData;


	// Add capitalize function to underscore
	_.mixin({
		capitalize: function(string) {
			return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
		}
	});


	/*$('.nav-collapse a').each(function(index, link) {

	 $(link).text(function(index, text) {

	 return t8(text)
	 })
	 })*/


	var subjects = [
		'math',
		'programming',
		'digital electronics',
		'modelling'
	]


	/*
	 * Root exercise from which all other exercises inherit
	 */

	// Automatically created attributes
	auto = {
		"id": 0,
		"created": "2013-01-01T12:00",
		"status": "unapproved"
	};

	// Attributes specified by the user
	specified = {
		"subject": "",
		"setting": "",
		"task": "",
		"solution": "",
		"credits": 3,
		"difficulty": 0.5,
		"given": "",
		"hints": null,
		"note": "",
		"tags": null,
		"prototype": null
	}

	// Merge to root exercise
	rootExercise = _.extend(auto, specified)


	/*
	 * Models
	 */

	Task = Backbone.Model.extend({
		defaults: rootExercise,
		schema: {
			subject: {type: 'Text', validators: ['required'], editorClass: 'input-medium'},
			task: {type: 'TextArea', editorClass: 'input-xlarge', validators: ['required']},
			setting: {type: 'TextArea', editorClass: 'input-xlarge'},
			solution: {type: 'TextArea', editorClass: 'input-xlarge'},
			credits: {type: 'Number', editorClass: 'input-mini', editorAttrs: {min: 0}},
			difficulty: {type: 'Number', editorClass: 'input-mini', editorAttrs: {min: 0, max: 1}},
			note: {type: 'Text', editorClass: 'input-large'},
			tags: {type: 'Text', editorClass: 'input-large'}
		},
		initialize: function() {
		}
	});


	/*
	 * Collections
	 */

	TasksCollection = Backbone.Collection.extend({
		model: Task,
		url: 'js/tasks.js',
		parse: function(response) {
			return response.tasks
		}
	});


	/*
	 *	Views
	 */

	TasksListView = Backbone.View.extend({
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
	});

	TasksListItemView = Backbone.View.extend({
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

	});

	TaskView = Backbone.View.extend({
		template: _.template($('#exerciseTemplate').html()),
		events: {
			"click #showHint": "showHint"
		},
		initialize: function() {
			this.model.on('reset', this.render, this)

			this.model.set('displayedHints', 0)
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

				var hints = $('#hints')

				if(counter == 0)
					$('<hr>')
						.hide()
						.appendTo(hints)
						.slideDown('fast')


				var el = $('<div class="alert alert-info">' + this.model.get('hints')[counter] + '</div>')
					.hide()
					.appendTo(hints)
					.slideDown('fast')

				MathJax.Hub.Queue(["Typeset", MathJax.Hub, el[0]])

				counter++
				this.model.set('displayedHints', counter)
			}

			this.renderBar()
		}
	});

	TaskBarView = Backbone.View.extend({
		tagName: 'ul',
		className: 'nav nav-list',
		template: _.template($('#exerciseSideBarTemplate').html()),
		render: function() {
			this.$el.html(this.template(this.model.toJSON()))

			this.$("[rel=tooltip]").tooltip();

			return this
		}
	});

	AppView = Backbone.View.extend({
		render: function() {

		}
	});


	/*
	 *	Exercise Formular
	 */

	ExerciseFormView = Backbone.View.extend({
		id: "exerciseModal",
		className: "modal hide fade",
		events: {
			"click #exerciseFormSubmit": "showModal"
		},
		initialize: function() {

			exerciseFormData = new Task()//{created: new Date()});

			ExerciseForm = new Backbone.Form({
				model: exerciseFormData,
				idPrefix: 'exerciseForm-'
			})

		},

		attributes: {
			role: "dialog"
		},

		template: _.template($('#exerciseFormTemplate').html()),

		showModal: function() {

			if(!ExerciseForm.validate()){

				ExerciseForm.commit()

				var subject = "Exercise Submission",
					data = encodeURIComponent(JSON.stringify(exerciseFormData.attributes))

				window.location = 'mailto:submission@educatopia.org?subject=' + subject + '&body=' + data
			}
		},

		render: function() {
			this.$el.html(this.template())

			this.$('.modal-body').append(ExerciseForm.render().el)

			this.$('#exerciseForm-subject').typeahead({
				source: _.map(subjects, _.capitalize)
			})

			// Fixes backbone-form bug of not being able to set stepsize
			this.$('#exerciseForm-difficulty').attr('step', 0.1)

			return this
		}
	});


	/*
	 *	Router
	 */

	AppRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			":subject": "list"
		},
		initialize: function() {
			this.tasksList = new TasksCollection()

			this.route(/^(\d+)$/, "taskDetails")

			$('body').append(new ExerciseFormView().render().el)
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

	appRouter = new AppRouter();

	Backbone.history.start()



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
