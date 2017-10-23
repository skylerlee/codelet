require.config({
  paths: {
    ace: '{{ site.data.urls.ace-root }}',
    mustache: '{{ site.data.urls.mustache }}'
  }
});

require([
  'ace/ace',
  'mustache'
], function (ace, mustache) {
  ace.config.set('packaged', true);
  ace.config.set('basePath', '{{ site.data.urls.ace-root }}');

  var srcBox = ace.edit('src-box');
  var outBox = ace.edit('out-box');

  appendStyle(
    '.ace-editor {\n' +
    '  font-size: 16px;\n' +
    '  height: 22em;\n' +
    '  margin-bottom: 1rem;\n' +
    '}'
  );

  init(srcBox, {
    mode: 'json',
    value: '{ "name": "Problem Name" }'
  });
  init(outBox, {
    mode: 'markdown'
  });

  var template = outBox.getValue();
  mustache.parse(template);

  srcBox.on('change', function () {
    try {
      var context = JSON.parse(srcBox.getValue());
      var output = mustache.render(template, context);
      outBox.setValue(output);
    } catch (e) {
      // omit error
    }
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
