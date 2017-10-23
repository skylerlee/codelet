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
    mode: 'json'
  });
  init(outBox, {
    mode: 'markdown'
  });

  var source = preproc(srcBox.getValue());
  srcBox.setValue(source);

  var template = outBox.getValue();
  mustache.parse(template);

  srcBox.on('change', function () {
    try {
      var context = JSON.parse(srcBox.getValue());
      postproc(context);
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

  function preproc(str) {
    return str.replace('%t', Date.format('%4Y-%2M-%2D %2h:%2m:%2s %z'));
  }

  function postproc(data) {
    var dashedName = data.name.toLowerCase().replace(/\s/g, '-');
    data.fullname = data.time.substr(0, 10) + '-' + dashedName;
  }
});
