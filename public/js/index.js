(function() {

	var ExercisesTableView;
	var appRouter,
		AppRouter,
		ExerciseFormView,
		AppView,
		ExerciseBarView,
		ExerciseView,
		ExercisesListItemView,
		ExercisesListView,
		Exercise,
		Exercises,
		international = i18n(dictionary),
		t8 = international.map,
		auto,
		specified,
		rootExercise,
		ExerciseForm,
		exerciseFormData,
		ReferenceView,
		ReferenceListView,
		subjects = [
			'math',
			'programming',
			'digital electronics',
			'modelling'
		],
		subjectsExtended = {
			'math': {
				proposition: "",
				set: "",
				proof: "",
				relation: "",
				function: ""

			},
			'programming': {

			},
			'digital electronics': {

			},
			'modelling': {

			}
		},
		ExercisesView,
		ReferenceListItemView,
		c = console,
		appView,
		BannerView


	/*
	 offlineScripts = [
	 "components/MathJax/index.js",
	 "components/jquery/jquery.js",
	 "components/underscore/underscore.js",
	 "components/backbone/backbone.js",
	 "components/backbone-forms/distribution/backbone-forms.js",
	 "components/bootstrap-template/index.js",
	 "components/dominate/index.js",
	 "components/highlight/index.js",
	 "components/bootstrap/bootstrap.js"
	 ],
	 onlineScripts = [
	 "//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML",
	 "//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js",
	 "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js",
	 "//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js",
	 "//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.0/bootstrap.min.js",
	 "//raw.github.com/powmedia/backbone-forms/v0.10.0/distribution/backbone-forms.min.js",
	 "//raw.github.com/powmedia/backbone-forms/v0.10.0/distribution/templates/bootstrap.js",
	 "//cdnjs.cloudflare.com/ajax/libs/highlight.js/7.3/highlight.min.js",
	 "//raw.github.com/adius/DOMinate/master/src/dominate.js"
	 ]


	 onlineScripts.forEach(function(script){
	 var link
	 link = document.createElement("script")
	 link.setAttribute("src", "http:" + script)
	 link.setAttribute("type", "text/javascript")

	 document.body.appendChild(link)
	 })
	 */


	// Add capitalize function to underscore
	_.mixin({
		capitalize: function(string) {
			return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
		}
	})


	/*$('.nav-collapse a').each(function(index, link) {

	 $(link).text(function(index, text) {

	 return t8(text)
	 })
	 })*/


	/* ======
	 * Models
	 */

	Exercise = Backbone.Model.extend({
		url: '/api/exercises',
		schema: {
			task: {
				type: 'TextArea',
				validators: ['required'],
				editorClass: 'input-xlarge',
				help: 'Detailed description of the task which must be solved.' +
					'Try to split up large tasks into its sub-tasks.'
			},
			approach: {
				type: 'TextArea',
				editorClass: 'input-xlarge',
				help: 'All the necessary steps to get to a solution.'
			},
			solution: {
				type: 'Text',
				editorClass: 'input-medium',
				help: 'Try to keep the solution as short as possible to make it comparable!' +
					'All further information should be written down in the approach section.'
			},
			subjects: {
				type: 'List',
				validators: ['required'],
				editorClass: 'input-medium',
				help: 'Specify the subject of the exercise. (i.e. Math, Biology, …)'
			},
			type: {
				type: 'Select',
				options: ['', 'Calculate', 'Explain', 'Name', 'Describe', 'Proof', 'Assign', 'Draw', 'Choose'],
				validators: ['required'],
				editorClass: 'input-medium',
				help: 'What is the main task of the exercise?'
			},
			credits: {
				type: 'Number',
				editorClass: 'input-mini',
				editorAttrs: {min: 0},
				help: 'Consider difficulty, necessary steps and importance of the exercise. ' +
					'Each credit-point relates to a noteworthy accomplishment while solving the task. ' +
					'Recommended range is 1 - 10 credits.'
			},
			difficulty: {
				type: 'Number',
				editorClass: 'input-mini',
				editorAttrs: {min: 0, max: 1, step: 0.1, title: 'Tooltip help'},
				help: 'The difficulty level of the exercise ranges ' +
					'from excluded 0 (So easy that everybody can solve it) ' +
					'to excluded 1 (So difficult that nobody can solve it)'
			},
			duration: {
				type: 'Number',
				editorClass: 'input-mini',
				editorAttrs: {min: 0},
				help: 'How long does it take to solve the exercise for an average person?'
			},
			tags: {
				type: 'List',
				editorClass: 'input-large',
				help: 'All the things that should be associated with this exercise'
			},
			note: {
				type: 'TextArea',
				editorClass: 'input-large',
				help: 'Any additional information'
			},
			hints: {
				type: 'List',
				editorClass: 'input-large',
				help: 'Any information which helps one to solve the exercise when he\'s stuck.'
			}
		}
	})


	/* ===========
	 * Collections
	 */

	Exercises = Backbone.Collection.extend({
		model: Exercise,
		url: '/api/exercises'
		/*parse: function(response) {
		 return response.exercises
		 }*/
	})


	/* =====
	 * Views
	 */

	ExerciseView = Backbone.View.extend({
		template: _.template($('#exerciseTemplate').html()),
		events: {
			"click #showHint": "showHint"
		},
		initialize: function() {
			this.model.on('reset', this.render, this)

			this.model.set('displayedHints', 0)
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
		},
		renderExercise: function() {
			this.$el
				.html(this.template({data: this.model.toJSON()}))
				.fadeIn()

			var snippets

			if(snippets = this.$('pre code')[0])
				hljs.highlightBlock(snippets)

			return this
		},
		renderBar: function() {
			this.$('.span3')
				.html(new ExerciseBarView({model: this.model}).render().el)
				.fadeIn()

			return this
		},
		render: function() {
			this
				.renderExercise()
				.renderBar()


			MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el])

			return this
		}
	})

	ExercisesView = Backbone.View.extend({
		template: _.template($('#taskListTemplate').html()),
		render: function() {
			this.$el.html(this.template())

			return this
		}
	})

	ExercisesListView = Backbone.View.extend({
		tagName: 'ul',
		className: 'nav nav-list',
		render: function() {

			_.each(this.collection, function(exercise, i) {

				i = i + 1

				this.$el.append(
					new ExercisesListItemView({
							model: exercise,
							id: (i <= 9) ? '0' + i : i
						}
					).render().el)

			}, this)


			return this
		}
	})

	ExercisesListItemView = Backbone.View.extend({
		tagName: "li",
		events: {
			"click .exerciseLink": function() {

				var id = this.model.get('id'),
					task = appRouter.tasksList.get(id),
					taskView = new ExerciseView({model: task})

				$('#content')
					.html(taskView.render().el)
					.fadeIn('fast')
			}
		},
		initialize: function() {

			this.muted = (!(this.model.get('solution') || this.model.get('solutions'))) ? 'muted' : ''

		},
		render: function() {

			DOMinate(
				[this.el,
					['small.exerciseLink',
						['a', String(this.id) + '. Aufgabe',
							{class: this.muted}
						]
					]
				]
			)

			return this
		}
	})


	ExerciseBarView = Backbone.View.extend({
		tagName: 'ul',
		className: 'nav nav-list',
		template: _.template($('#exerciseSideBarTemplate').html()),
		render: function() {
			this.$el.html(this.template({data: this.model.toJSON()}))

			this.$("[rel=tooltip]").tooltip();

			return this
		}
	})


	ExercisesTableView = Backbone.View.extend({
		id: 'exercise',
		template: _.template($('#exercisesTemplate').html()),
		render: function() {

			this.$el.html(this.template())

			return this
		}
	});

	ExerciseFormView = Backbone.View.extend({
		id: "exerciseModal",
		className: "modal hide fade",
		events: {
			"click #exerciseFormSubmit": "showModal"
		},
		attributes: {
			role: "dialog"
		},

		template: _.template($('#exerciseFormTemplate').html()),

		initialize: function() {

			ExerciseForm = new Backbone.Form({
				model: new Exercise(),
				idPrefix: 'exerciseForm-',
				fieldsets: [
					{
						legend: 'Exercise',
						fields: [
							'task',
							'approach',
							'solution'
						]
					},
					{
						legend: 'Details',
						fields: [
							'subjects',
							'type',
							'credits',
							'difficulty',
							'duration',
							'hints',
							'tags',
							'note'
						]
					}
				]
			})
		},

		showModal: function() {

			if(!ExerciseForm.validate()) {

				ExerciseForm.commit()

				ExerciseForm.model.save("", "", {
					success: function() {
						$('#exerciseModal').modal('hide')
					},
					error: function() {
						alert("Something went wrong!")
					}
				})
			}
		},

		render: function() {
			this.$el.html(this.template())

			this.$('.modal-body').append(ExerciseForm.render().el)

			this.$('#exerciseForm-subjects').typeahead({
				source: _.map(subjects, _.capitalize)
			})

			//Fixes backbone-form bug of not being able to set stepsize
			this.$('#exerciseForm-difficulty').attr('step', 0.1)


			this
				.$('.icon-question-sign')
				.tooltip()


			//this.$('.icon-question-sign')

			return this
		}
	})


	ReferenceView = Backbone.View.extend({

		id: 'reference',

		template: _.template($('#referenceTemplate').html()),

		render: function() {

			this.$el.html(this.template())

			this.$('.span3')
				.html(new ReferenceListView({collection: this.options.data}).render().el)

			return this
		}
	})

	ReferenceListView = Backbone.View.extend({
		tagName: 'ul',
		className: 'nav nav-list affix-top',
		//attributes: {'data-spy': "affix"},
		render: function() {

			_.each(this.collection.references.math, function(value, key, list) {

				this.$el.append(new ReferenceListItemView({model: value, id: key}).render().el)

			}, this)

			return this
		}
	})

	ReferenceListItemView = Backbone.View.extend({
		tagName: "li",
		events: {
			"click a": function() {

				var ref,
					cont

				ref = $('#referenceContent').html('')

				cont = DOMinate(
					[ref[0],
						['ol$list']
					])

				_.each(this.model, function(item, index) {

					$(cont.list).append($('<li>' + item + '</li><hr>'))
				})

				MathJax.Hub.Queue(["Typeset", MathJax.Hub, cont.list])
			}
		},
		render: function() {

			DOMinate(
				[this.el,
					['a', String(this.id)]
				]
			)

			return this
		}
	})


	AppView = Backbone.View.extend({

		events: {
		},
		initialize: function() {

		},

		render: function() {

		}
	})

	BannerView = Backbone.View.extend({
		render: function() {

			this.$el.html(_.template($('#bannerTemplate').html()))

			return this
		}
	})


	/*
	 *	Router
	 */

	AppRouter = Backbone.Router.extend({
		routes: {
			"": "home",
			"exercises/:subject": "list",
			"reference/:subject": "reference"
		},
		initialize: function() {
			this.tasksList = new Exercises()

			this.route(/^exercises\/(\d+)$/, "taskDetails")

			$('body').append(new ExerciseFormView().render().el)
		},

		list: function(subject) {

			this.tasksList.fetch({
					dataType: 'json',
					success: function(collection) {

						var tasksListView = new ExercisesListView({

								collection: collection.filter(function(task) {

									return _.contains(task.get("subjects"), subject)
								})
							}
						)


						$('#contentWrapper')
							.html(new ExercisesView().render().el)

						$('#sidebar')
							.html(tasksListView.render().el)
							.fadeIn('fast')
					}
				}
			)

			$('#tasks').fadeIn()
		},

		reference: function(subject) {

			$.ajax({
				url: "js/references.json",
				dataType: "json",
				context: this,
				success: function(data) {

					$('#contentWrapper')
						.empty()
						.append(new ReferenceView({data: data}).render().el)
				}
			}, this)

		},

		taskDetails: function(id) {


			if(this.tasksList.length == 0) {

				var self = this

				this.tasksList.fetch({
					success: function() {
						self.taskDetails(id)
					}
				})

			} else {


				$('#contentWrapper')
					.html(new ExercisesView().render().el)

				this.task = this.tasksList.get(id)

				this.taskView = new ExerciseView({model: this.task})

				console.log(this.taskView.render().el)

				$('#content')
					.html(this.taskView.render().el)
					.fadeIn('fast')
			}
		},

		home: function() {

			$('#contentWrapper')
				.html(new BannerView().render().el)
		}
	})

	appRouter = new AppRouter()
	appView = new AppView({el: document.body})

	Backbone.history.start()

	//console.log(international.getUntranslated())
}())
