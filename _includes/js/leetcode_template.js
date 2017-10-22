require.config({
  paths: {
    ace: '{{ site.data.urls.ace }}'
  }
});

require([
  'ace/ace'
], function (ace) {
  var srcBox = ace.edit('src-box');
  var outBox = ace.edit('out-box');
});
