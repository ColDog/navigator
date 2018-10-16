// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require jquery.js
//= require turbolinks
//= require bootstrap.js
//= require codemirror.js
//= require codemirror-yaml.js
//= require_tree .

var REFRESH_INTERVAL = 1000;

$(document).on('turbolinks:load', function() {
  var els = document.querySelectorAll(".codemirror");
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    CodeMirror.fromTextArea(el);
  }
});

// $(document).ready(function() {
//   setInterval(function() {
//     Turbolinks.visit(location.toString());
//   }, REFRESH_INTERVAL);
// });
