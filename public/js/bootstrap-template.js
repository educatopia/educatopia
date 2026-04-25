/**
 * Include this template file after backbone-forms.amd.js
 * to override the default templates
 *
 * 'data-*' attributes control where elements are placed
 */

/* global _ */
/* global Backbone */

!(function (Form) {
  /**
   * Bootstrap templates for Backbone Forms
   */
  Form.template = _.template('\
    <form data-fieldsets></form>\
  ')

  Form.Fieldset.template = _.template('\
    <fieldset data-fields>\
      <% if (legend) { %>\
        <legend><%= legend %></legend>\
      <% } %>\
    </fieldset>\
  ')

  Form.Field.template = _.template('\
    <div class="row mb-3 field-<%= key %>">\
      <label class="col-lg-2 col-form-label" for="<%= editorId %>">\
        <%= title %>\
        <span class="text-muted" \
        title="<%= help %>" data-container="body">?</span>\
      </label>\
      <div class="col-lg-10" data-editor>\
        <div class="alert alert-danger" data-error></div>\
      </div>\
    </div>\
  ')

  Form.NestedField.template = _.template('\
    <div class="field-<%= key %>">\
      <div title="<%= title %>">\
        <span data-editor></span>\
        <div class="form-text text-danger" data-error></div>\
      </div>\
      <div class="form-text"><%= help %></div>\
    </div>\
  ')

  Form.editors.List.template = _.template('\
    <div class="bbf-list">\
      <ul class="row list-unstyled" data-items></ul>\
      <button class="btn btn-secondary bbf-add" data-action="add">\
        Add\
      </button>\
    </div>\
  ')

  Form.editors.List.Item.template = _.template('\
    <li class="row col-lg-8">\
      <div data-editor class="col-lg-11"></div>\
      <button type="button" class="btn-close bbf-del" data-action="remove" aria-label="Remove"></button>\
      <div class="alert alert-danger" data-error></div>\
    </li>\
  ')

  Form.editors.List.NestedModel.template = _.template('\
    <div class="bbf-list-modal"><%= summary %></div>\
  ')

  Form.editors.List.Object.template = Form.editors.List.NestedModel.template

})(Backbone.Form)
