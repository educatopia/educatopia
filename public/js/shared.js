var shared = {}

shared.exerciseSchema = {
	task: {
		type: 'TextArea',
		validators: ['required'],
		editorClass: 'form-control',
		editorAttrs: {rows: 10},
		help: 'Detailed description of the task which must be solved.' +
		      'Try to split up large tasks into its sub-tasks.'
	},
	approach: {
		type: 'TextArea',
		editorClass: 'form-control',
		editorAttrs: {rows: 10},
		help: 'All the necessary steps to get to a solution.'
	},
	solutions: {
		type: 'List',
		editorClass: 'form-control',
		help: 'The different solutions should be equally correct.' +
		      'Try to keep them as short as possible to make them machine readable! ' +
		      'All further information should be written down in the approach section.'
	},
	subjects: {
		type: 'List',
		validators: ['required'],
		editorClass: 'form-control',
		help: 'Specify the subject of the exercise. (i.e. Math, Biology, …)'
	},
	type: {
		type: 'Select',
		options: [
			'',
			'Calculate',
			'Explain',
			'Name',
			'Describe',
			'Proof',
			'Assign',
			'Draw',
			'Choose',
			'Transform'
		],
		validators: ['required'],
		editorClass: 'form-control',
		help: 'What is the main task of the exercise?'
	},
	credits: {
		type: 'Number',
		editorClass: 'form-control',
		editorAttrs: {min: 0},
		help: 'Consider difficulty, necessary steps and importance of the exercise. ' +
		      'Each credit-point represents a noteworthy accomplishment while solving the task. ' +
		      'Recommended range is 1 - 10 credits.'
	},
	difficulty: {
		type: 'Number',
		editorClass: 'form-control',
		editorAttrs: {min: 0, max: 1, step: 0.1, title: 'Tooltip help'},
		help: 'The difficulty level of the exercise ranges ' +
		      'from excluded 0 (So easy that everybody can solve it) ' +
		      'to excluded 1 (So difficult that nobody can solve it)'
	},
	duration: {
		type: 'Number',
		editorClass: 'form-control',
		editorAttrs: {min: 0},
		help: 'How long does it take to solve the exercise for an average person?'
	},
	tags: {
		type: 'List',
		editorClass: 'form-control',
		help: 'All the things that should be associated with this exercise'
	},
	note: {
		type: 'TextArea',
		editorClass: 'form-control',
		editorAttrs: {rows: 5},
		help: 'Any additional information'
	},
	hints: {
		type: 'List',
		editorClass: 'form-control',
		help: 'Any information which helps one to solve the exercise when he\'s stuck.'
	}
}

shared.exerciseFieldsets = [
	{
		fields: [
			'task',
			'approach',
			'solutions'
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
