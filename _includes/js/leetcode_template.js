require.config({
  paths: {
    ace: '{{ site.data.urls.ace-root }}'
  }
});

require([
  'ace/ace'
], function (ace) {
  ace.config.set('packaged', true);
  ace.config.set('basePath', '{{ site.data.urls.ace-root }}');

  var srcBox = ace.edit('src-box');
  var outBox = ace.edit('out-box');

  appendStyle(
    '.ace-editor {\n' +
    '  font-size: 16px;\n' +
    '  height: 300px;\n' +
    '  margin-bottom: 1rem;\n' +
    '}'
  );

  init(srcBox, {
    mode: 'json'
  });
  init(outBox, {
    mode: 'markdown'
  });

  function init(editor, options) {
    options = options || {};
    editor.setTheme('ace/theme/monokai');
    editor.getSession().setTabSize(2);
    if (options.value) {
      editor.setValue(options.value);
    }
    if (options.mode) {
      editor.getSession().setMode('ace/mode/' + options.mode);
    }
  }
});
