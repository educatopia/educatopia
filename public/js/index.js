/*
global Backbone, MathJax, marked,
_, shaven, shared,
hljs, Login
*/

!(function () {

  // jshint maxstatements: 35

  let ExerciseTabView
  let appRouter
  let AppRouter
  let AppView
  let ExerciseSidebarView
  let ExerciseView
  let ExercisesListItemView
  let ExercisesListView
  let Exercise
  let Exercises
  // let international = i18n(dictionary)
  // let t8 = international.map
  // let auto
  // let specified
  // let rootExercise
  // let ExerciseForm
  // let exerciseFormData
  let ReferenceView
  let ReferenceListView
  // subjects = [
  //   'math',
  //   'programming',
  //   'digital electronics',
  //   'modelling',
  //   'internet technologies',
  // ],
  // subjectsExtended = {
  //   math: {
  //     proposition: '',
  //     set: '',
  //     proof: '',
  //     relation: '',
  //     function: '',
  //   },
  //   programming: {},
  //   'digital electronics': {},
  //   modelling: {},
  // },
  let ExercisesView
  let ReferenceListItemView
  let appView
  let BannerView
  let ExerciseEditView
  let ExercisesTableView
  let ExerciseEditForm
  // let ExerciseHistoryForm
  let ExerciseHistoryView
  let LoginView
  let NavbarView
  let SignupView
  let LoginForm
  let SignupForm
  // let User


  marked.setOptions({
    gfm: true,
    /* highlight: function (code, lang, callback) {
     pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
     if (err) return callback(err);
     callback(null, result.toString());
     });
     },*/
    tables: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-',
  })


  /*
   offlineScripts = [
   'components/MathJax/index.js',
   'components/jquery/jquery.js',
   'components/underscore/underscore.js',
   'components/backbone/backbone.js',
   'components/backbone-forms/distribution/backbone-forms.js',
   'components/bootstrap-template/index.js',
   'components/dominate/index.js',
   'components/highlight/index.js',
   'components/bootstrap/bootstrap.js'
   ],
   onlineScripts = [
   '//cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_HTMLorMML',
   '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js',
   '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js',
   '//cdnjs.cloudflare.com/ajax/libs/backbone.js/0.9.10/backbone-min.js',
   '//cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/2.3.0/bootstrap.min.js',
   '//raw.github.com/powmedia/backbone-forms/v0.10.0
     /distribution/backbone-forms.min.js',
   '//raw.github.com/powmedia/backbone-forms/v0.10.0
     /distribution/templates/bootstrap.js',
   '//cdnjs.cloudflare.com/ajax/libs/highlight.js/7.3/highlight.min.js',
   '//raw.github.com/ad-si/shaven/master/src/dominate.js'
   ]


   onlineScripts.forEach(function(script){
   var link
   link = document.createElement('script')
   link.setAttribute('src', 'http:' + script)
   link.setAttribute('type', 'text/javascript')

   document.body.appendChild(link)
   })
   */


  // Add capitalize function to underscore
  _.mixin({
    capitalize: function (string) {
      return string.charAt(0)
        .toUpperCase() + string.substring(1)
        .toLowerCase()
    },
  })


  /*
   $('.nav-collapse a').each(function(index, link) {

   $(link).text(function(index, text) {

   return t8(text)
   })
   })
   */


  // Models

  Exercise = Backbone.Model.extend({
    url: '/api/exercises',
    parse: function (item) {
      // jshint maxstatements: 15
      // Add missing fields

      item.task = item.task || ''
      item.approach = item.approach || ''
      item.solutions = item.solutions || ''
      item.subjects = item.subjects || ''
      item.type = item.type || ''
      item.credits = item.credits || ''
      item.difficulty = item.difficulty || ''
      item.duration = item.duration || ''
      item.tags = item.tags || ''
      item.note = item.note || ''
      item.hints = item.hints || ''
      item.flags = item.flags || ''

      return item
    },
    schema: shared.exerciseSchema,
  })

  // User = Backbone.Model.extend({
  //   url: '/api/users',
  //   schema: {
  //     firstName: {
  //       type: 'Text',
  //       validators: ['required'],
  //       editorClass: 'form-control',
  //       help: 'Your first name.',
  //     },
  //     lastName: {
  //       type: 'Text',
  //       validators: ['required'],
  //       editorClass: 'form-control',
  //       help: 'Your first name.',
  //     },
  //     username: {
  //       type: 'Text',
  //       validators: ['required'],
  //       editorClass: 'form-control',
  //       help: '',
  //     },
  //     password: {
  //       type: 'Password',
  //       editorClass: 'form-control',
  //       help: '',
  //     },
  //     birthday: {
  //       type: 'Date',
  //       editorClass: 'form-control',
  //       editorAttrs: {min: 0},
  //       help: 'Consider difficulty, necessary steps and' +
  //             'importance of the exercise. ' +
  //             'Each credit-point represents a noteworthy accomplishment' +
  //             'while solving the task. ' +
  //             'Recommended range is 1 - 10 credits.',
  //     },
  //     difficulty: {
  //       type: 'Number',
  //       editorClass: 'form-control',
  //       editorAttrs: {min: 0, max: 1, step: 0.1, title: 'Tooltip help'},
  //       help: 'The difficulty level of the exercise ranges ' +
  //             'from excluded 0 (So easy that everybody can solve it) ' +
  //             'to excluded 1 (So difficult that nobody can solve it)',
  //     },
  //     duration: {
  //       type: 'Number',
  //       editorClass: 'form-control',
  //       editorAttrs: {min: 0},
  //       help: 'How long does it take to solve the exercise' +
  //             'for an average person?',
  //     },
  //     tags: {
  //       type: 'List',
  //       editorClass: 'form-control',
  //       help: 'All the things that should be associated with ' +
  //             'this exercise',
  //     },
  //     note: {
  //       type: 'TextArea',
  //       editorClass: 'form-control',
  //       editorAttrs: {rows: 5},
  //       help: 'Any additional information',
  //     },
  //     hints: {
  //       type: 'List',
  //       editorClass: 'form-control',
  //       help: 'Any information which helps one to solve the exercise ' +
  //             'when they\'re stuck.',
  //     },
  //   },
  // })


  // Collections

  Exercises = Backbone.Collection.extend({
    model: Exercise,
    url: '/api/exercises',
  })


  // Views

  ExerciseView = Backbone.View.extend({
    template: _.template($('#exerciseTemplate')
      .html()),
    initialize: function () {

      if (this.model) {

        this.model.on('reset', this.render, this)

        this.model.set('displayedHints', 0)
        // TODO: Remove from model before saving
      }
      else {
        this.model = new Exercise()
      }
    },

    renderExercise: function () {

      this
        .$el
        .html(this.template({data: null}))

      return this
    },

    renderExerciseTab: function () {

      this
        .$('#tab1')
        .html(new ExerciseTabView({model: this.model})
          .render().el)

      this
        .$('pre code')
        .each((index, code) => {
          hljs.highlightBlock(code)
        })

      return this

    },

    renderEdit: function () {

      if (this.model) {
        this
          .$('#tab2')
          .html(new ExerciseEditView({model: this.model})
            .render().el)
      }
      else {
        this
          .$('#tab2')
          .html(new ExerciseEditView()
            .render().el)
      }

      return this
    },

    renderHistory: function () {

      // new ExerciseHistoryView({model: this.model}).render()

      this
        .$('#tab3')
        .html(new ExerciseHistoryView({model: this.model})
          .render().el)

      return this
    },

    renderSidebar: function () {

      this
        .$('#exerciseSidebar')
        .html(new ExerciseSidebarView({model: this.model})
          .render().el)

      return this
    },

    render: function () {

      // jshint maxstatements: 11

      this.renderExercise()
      this.renderEdit()
      this.renderHistory()

      if (this.model) {
        this
          .renderExerciseTab()
          .renderSidebar()
      }
      else {
        this.$el
          .addClass('well')
          .addClass('col-lg-12')

        this.$('#tabHandlers li:nth-of-type(1)')
          .removeClass('active')

        this.$('#tabHandlers li:nth-of-type(2)')
          .addClass('active')

        this.$('#tab2')
          .css('display', 'block')
      }

      MathJax.Hub
        .Queue(['Typeset', MathJax.Hub, this.el])

      return this
    },
  })

  ExerciseTabView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#exerciseTabTemplate')
      .html()),
    render: function () {

      let data

      if (!this.model.isNew()) {

        data = this.model.toJSON()

        marked(data.task, (error, content) => {
          if (error) throw error

          data.task = content

        })

        marked(data.approach, (error, content) => {
          if (error) throw error

          data.approach = content
        })

        this.$el.html(this.template({data: data}))

      }

      return this
    },
  })

  ExerciseEditView = Backbone.View.extend({
    tagName: 'div',
    id: 'exerciseEdit',
    template: _.template($('#exerciseEditTemplate')
      .html()),
    events: {
      'click #exerciseEditSubmit': 'submit',
    },
    // template: _.template($('#exerciseEditTemplate').html()),

    initialize: function () {

      this.model = this.model || new Exercise()

      ExerciseEditForm = new Backbone.Form({
        model: this.model,
        idPrefix: 'exerciseEdit-',
        fieldsets: shared.exerciseFieldsets,
      })
    },

    submit: function () {
      // TODO: Timestamp and user of modification
      // TODO: Use HTTP PATCH instead of PUT
      // TODO: Update history tab after successful update

      const errors = ExerciseEditForm.commit({validate: true})
      const submitSpan = this.$('#exerciseEditSubmit span')

      if (!errors) {
        // TODO: Use spin.js instead of glyphicons

        submitSpan
          .addClass('glyphicon')
          .addClass('glyphicon-refresh')


        ExerciseEditForm.model.save('', '', {
          success: function () {
            this
              .$('.successInfo')
              .removeClass('alert-danger')
              .addClass('alert-success')
              .text('The exercise was successfully saved')

            submitSpan
              .removeClass('glyphicon')
              .removeClass('glyphicon-refresh')
          },
          error: function () {

            submitSpan
              .removeClass('glyphicon')
              .removeClass('glyphicon-refresh')

            this
              .$('.successInfo')
              .removeClass('alert-success')
              .addClass('alert-danger')
              .text('An error occurred. Please try again later.')
          },
        })
      }
      else {

        this
          .$('.successInfo')
          .removeClass('alert-success')
          .addClass('alert-danger')
          .text('Please correct wrong fields')
      }
    },

    render: function () {

      this.$el.html(this.template())

      this.$el.prepend(ExerciseEditForm.render().el)


      // TODO: Include standalone-version of typeahead
      /*
       this.$('#exerciseForm-subjects').typeahead({
       source: _.map(subjects, _.capitalize)
       })
       */

      // Fixes backbone-form bug of not being able to set stepsize
      this
        .$('#exerciseEdit-difficulty')
        .attr('step', 0.1)

      this
        .$('.glyphicon-question-sign')
        .tooltip()

      return this
    },
  })

  ExerciseHistoryView = Backbone.View.extend({
    template: _.template($('#exerciseHistoryTemplate')
      .html()),
    render: function () {

      // TODO: Listen to change event and redraw

      let url

      if (this.model.id) {
        url = '/api/exercises/history/' + this.model.id

        $.getJSON(
          url,
          (data) => {
            this.$el.html(this.template({exercises: data}))
          }
        )
      }


      return this
    },
  })

  ExerciseSidebarView = Backbone.View.extend({
    tagName: 'ul',
    className: 'list-group',
    template: _.template($('#exerciseSideBarTemplate')
      .html()),
    events: {
      'click #showHint': 'showHint',
    },
    showHint: function () {
      let counter = this.model.get('displayedHints')
      let hints
      let el

      if (counter < this.model.get('hints').length) {

        hints = $('#hints')

        if (counter === 0) {
          $('<hr>')
            .hide()
            .appendTo(hints)
            .slideDown('fast')
        }


        el = $('<div class="alert alert-info">' +
               this.model.get('hints')[counter] +
               '</div>')
          .hide()
          .appendTo(hints)
          .slideDown('fast')

        MathJax.Hub
          .Queue(['Typeset', MathJax.Hub, el[0]])

        counter++
        this.model.set('displayedHints', counter)
      }

      this.renderBar()
    },
    render: function () {

      if (!this.model.isNew()) {

        this.$el.html(this.template({data: this.model.toJSON()}))

        this.$('[rel=tooltip]')
          .tooltip()
      }

      return this
    },
  })


  ExercisesView = Backbone.View.extend({
    template: _.template($('#taskListTemplate')
      .html()),
    render: function () {
      this.$el.html(this.template())

      return this
    },
  })

  ExercisesListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'nav nav-list',
    render: function () {

      _.each(this.collection, function (exercise, index) {
        index += 1

        this.$el.append(
          new ExercisesListItemView({
            model: exercise,
            id: index <= 9
              ? '0' + index
              : index,
          }
          )
            .render().el)

      }, this)


      return this
    },
  })

  ExercisesListItemView = Backbone.View.extend({
    tagName: 'li',
    events: {
      'click .exerciseLink': function () {
        const id = this.model.get('id')
        const task = appRouter.tasksList.get(id)
        const taskView = new ExerciseView({model: task})

        $('#content')
          .html(taskView.render().el)
          .fadeIn()
      },
    },
    initialize: function () {

      this.muted = !(this.model.get('solution') ||
                      this.model.get('solutions')) ? 'muted' : ''

    },
    render: function () {

      shaven(
        [
          this.el,
          [
            'small.exerciseLink',
            [
              'a', String(this.id) + '. Aufgabe',
              {class: this.muted},
            ],
          ],
        ]
      )

      return this
    },
  })

  ExercisesTableView = Backbone.View.extend({
    id: 'exercises',
    template: _.template($('#exercisesTemplate')
      .html()),
    render: function () {
      const exercises = []

      _.each(this.collection.models, (exercise) => {
        const enhancedExercise = exercise.attributes
        const timestamp = enhancedExercise.id.substring(0, 8)
        const datetime = new Date(parseInt(timestamp, 16) * 1000)
          .toISOString()
          .substr(0, 19)
          .split('T')

        enhancedExercise.url = '#exercises/' + enhancedExercise.id
        enhancedExercise.date = datetime[0]
        enhancedExercise.time = datetime[1]

        exercises.push(enhancedExercise)

      }, this)

      this.$el.html(this.template({exercises: exercises}))

      return this
    },
  })


  ReferenceView = Backbone.View.extend({

    id: 'reference',

    template: _.template($('#referenceTemplate')
      .html()),

    render: function () {

      this.$el.html(this.template())

      this
        .$('#referenceSidebar')
        .html(new ReferenceListView({collection: this.options.data})
          .render()
          .el)

      return this
    },
  })

  ReferenceListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'list-group',
    // attributes: {'data-spy': 'affix'},
    render: function () {

      _.each(this.collection.references.math, function (value, key) {

        this.$el.append(new ReferenceListItemView({
          model: value,
          id: key,
        })
          .render().el)

      }, this)

      return this
    },
  })

  ReferenceListItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'list-group-item',
    events: {
      'click a': function () {
        let ref
        let cont

        ref = $('#referenceContent')
          .html('')

        cont = shaven(
          [
            ref[0],
            ['div.panel-heading', this.id],
            ['ul.list-group$list'],
          ])

        _.each(this.model, (item) => {

          $(cont.list)
            .append($('<li class=list-group-item>' + item + '</li>'))
        })

        MathJax.Hub
          .Queue(['Typeset', MathJax.Hub, cont.list])
      },
    },
    render: function () {

      shaven(
        [
          this.el,
          ['a', String(this.id)],
        ]
      )

      return this
    },
  })

  LoginView = Backbone.View.extend({
    id: 'loginModal',
    className: 'modal fade',
    template: _.template($('#loginModalTemplate')
      .html()),
    events: {
      'click .submit': 'submit',
      'click #forgotPassword': 'forgotPassword',
    },
    initialize: function () {

      LoginForm = new Backbone.Form({
        schema: {
          email: 'Text',
          password: 'Password',
        },
        idPrefix: 'login-',
      })

    },
    submit: function () {

      $.ajax({
        type: 'POST',
        url: '/api/register',
        data: Login.getValue,
        success: function () {
          alert('worked')
        },
        error: function (error) {
          throw error
        },
      })
    },
    forgotPassword: function () {
      alert('TODO')
    },
    render: function () {

      this
        .$el
        .html(this.template())

      this
        .$('.modal-body')
        .prepend(LoginForm.render().el)

      return this
    },
  })

  SignupView = Backbone.View.extend({
    id: 'signupModal',
    className: 'modal fade',
    template: _.template($('#signupModalTemplate')
      .html()),
    events: {
      'click .submit': 'submit',
    },
    initialize: function () {

      SignupForm = new Backbone.Form({
        schema: {
          firstName: 'Text',
          lastName: 'Text',
          email: 'Text',
          agreement: 'Checkbox',
        },
        idPrefix: 'login-',
      })

    },
    submit: function () {

      // TODO: Use a backbone model to store and submit data

      const element = this.$el

      $.ajax({
        type: 'POST',
        url: '/api/register',
        data: SignupForm.getValue(),
        success: function () {
          console.info('Signup was successful')

          element.modal('hide')
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.info('Signup was not successful')
          console.info(textStatus)
          console.info(errorThrown)
        },
      })
    },
    render: function () {

      this
        .$el
        .html(this.template())

      this
        .$('.modal-body')
        .append(SignupForm.render().el)

      return this
    },
  })


  ExerciseEditForm = new Backbone.Form({
    model: this.model,
    idPrefix: 'exerciseEdit-',
    fieldsets: [
      {
        fields: [
          'task',
          'approach',
          'solutions',
        ],
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
          'note',
        ],
      },
    ],
  })


  AppView = Backbone.View.extend({

    events: {},
    initialize: function () {

    },

    render: function () {

      $('body')
        .prepend(new NavbarView()
          .render().el)

      $('#newExercise')
        .click(() => {

          $('#contentWrapper')
            .html(new ExerciseView()
              .render().el)
            .fadeIn('fast')
        })

      $('#loginButton')
        .click(() => {

          $('body')
            .append(new LoginView()
              .render().el)

          $('#loginModal')
            .modal()
        })

      $('#signupButton')
        .click(() => {

          $('body')
            .append(new SignupView()
              .render().el)

          $('#signupModal')
            .modal()
        })

    },
  })

  BannerView = Backbone.View.extend({
    render: function () {

      this.$el.html(_.template($('#bannerTemplate')
        .html()))

      return this
    },
  })

  NavbarView = Backbone.View.extend({
    id: 'navbar',
    className: 'navbar navbar-inverse navbar-fixed-top',
    render: function () {

      this.$el.html(_.template($('#navbarTemplate')
        .html()))

      return this
    },
  })


  // Router

  AppRouter = Backbone.Router.extend({
    routes: {
      '': 'home',
      exercises: 'table',
      'exercises/:subject': 'list',
      'reference/:subject': 'reference',
    },
    initialize: function () {
      this.tasksList = new Exercises()
      this.exercisesList = new Exercises()

      this.route(/^exercises\/(\d+)$/, 'taskDetails')

      // $('body').append(new ExerciseFormView().render().el)
    },

    list: function (subject) {

      this.tasksList.fetch({
        dataType: 'json',
        success: function (collection) {

          const tasksListView = new ExercisesListView({

            collection: collection.filter((task) => {
              return _.contains(task.get('subjects'), subject)
            }),
          }
          )


          $('#contentWrapper')
            .html(new ExercisesView()
              .render().el)

          $('#sidebar')
            .html(tasksListView.render().el)
            .fadeIn('fast')
        },
      }
      )

      $('#tasks')
        .fadeIn()
    },

    table: function () {
      this.exercisesList.fetch({
        dataType: 'json',
        success: function (collection) {
          const exercisesTableView = new ExercisesTableView({
            collection: collection,
          })

          $('#contentWrapper')
            .html(exercisesTableView.render().el)
            .fadeIn('fast')
        },
      }
      )

      $('#tasks')
        .fadeIn()
    },

    reference: function () {
      $.ajax({
        url: 'js/references.json',
        dataType: 'json',
        context: this,
        success: function (data) {
          $('#contentWrapper')
            .empty()
            .append(new ReferenceView({data: data})
              .render().el)
        },
      }, this)

    },

    taskDetails: function (id) {
      if (this.tasksList.length === 0) {
        this.tasksList.fetch({
          success: function () {
            this.taskDetails(id)
          }.bind(this),
        })
      }
      else {
        $('#contentWrapper')
          .html(new ExercisesView()
            .render().el)

        this.task = this.tasksList.get(id)

        this.taskView = new ExerciseView({model: this.task})

        $('#content')
          .html(this.taskView.render().el)
          .fadeIn('fast')
      }
    },

    home: function () {
      $('#contentWrapper')
        .html(new BannerView()
          .render().el)
    },
  })

  appRouter = new AppRouter()
  appView = new AppView({el: document.body})
  appView.render()

  Backbone.history.start()

  // console.info(international.getUntranslated())

})(window, document)
