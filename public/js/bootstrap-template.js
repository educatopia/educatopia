'use strict'

/**
 * Include this template file after backbone-forms.amd.js to override the default templates
 *
 * 'data-*' attributes control where elements are placed
 */

/* jshint expr: true*/
/* global _ */
/* global Backbone */

!function (Form) {

	/**
	 * Bootstrap templates for Backbone Forms
	 */
	Form.template = _.template('\
		<form class="form-horizontal" data-fieldsets></form>\
	')

	Form.Fieldset.template = _.template('\
		<fieldset data-fields>\
			<% if (legend) { %>\
				<legend><%= legend %></legend>\
			<% } %>\
		</fieldset>\
	')

	Form.Field.template = _.template('\
		<div class="form-group field-<%= key %>">\
			<label class="col-lg-2 control-label" for="<%= editorId %>">\
				<%= title %>\
				<span class="glyphicon glyphicon-question-sign" \
				title="<%= help %>" data-container="body"></span>\
			</label>\
			<div class="col-lg-10" data-editor>\
				<div class="alert alert-danger" data-error></div>\
			</div>\
		</div>\
	')

	Form.NestedField.template = _.template('\
		<div class="field-<%= key %>">\
			<div title="<%= title %>" class="input-xlarge">\
				<span data-editor></span>\
				<div class="help-inline" data-error></div>\
			</div>\
			<div class="help-block"><%= help %></div>\
		</div>\
	')

	Form.editors.List.template = _.template('\
		<div class="bbf-list">\
			<ul class="row list-unstyled" data-items></ul>\
			<button class="btn btn-default bbf-add" data-action="add">\
				Add\
			</button>\
		</div>\
	')

	Form.editors.List.Item.template = _.template('\
		<li class="row col-lg-8">\
			<div data-editor class="col-lg-11"></div>\
			<button type="button" class="close bbf-del" data-action="remove">\
				&times;\
			</button>\
			<div class="alert alert-danger" data-error></div>\
		</li>\
	')

	Form.editors.List.NestedModel.template = _.template('\
		<div class="bbf-list-modal"><%= summary %></div>\
	')

	Form.editors.List.Object.template = Form.editors.List.NestedModel.template

}(Backbone.Form)
