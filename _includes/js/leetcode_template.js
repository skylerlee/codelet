require.config({
  paths: {
    ace: '{{ site.data.urls.ace }}'
  }
});

require([
  'ace/ace',
  'ace/theme-monokai'
], function (ace) {
  var srcBox = ace.edit('src-box');
  var outBox = ace.edit('out-box');

  appendStyle(
    '.ace-editor {\n' +
    '  font-size: 16px;\n' +
    '  height: 300px;\n' +
    '  margin-bottom: 1rem;\n' +
    '}'
  );
});
