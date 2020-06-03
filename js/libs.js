// Use the Fliplet.Registry to define javascript libraries
// that your widget need to use. Make sure to namespace them
// with the widget version (e.g. 1.0) so that new versions
// won't conflict between each other.

Fliplet.Registry.set('container:1.0:core', function (element, data) {
  var WIDGET_INSTANCE_SELECTOR = '[data-fl-widget-instance]';
  var WIDGET_INSTANCE_ID_DATA = 'id';

  function replaceWidgetInstances($html) {
    $html.find(WIDGET_INSTANCE_SELECTOR).replaceWith(function () {
      var widgetInstanceId = $(this).data(WIDGET_INSTANCE_ID_DATA);

      return '{{{widget ' + widgetInstanceId + '}}}';
    });

    return $html;
  }

  function studioEventHandler() {
    Fliplet.Studio.onEvent(function (event) {
      var eventDetail = event.detail;

      if (eventDetail.id !== data.id) {
        return;
      }

      switch (eventDetail.type) {
        case 'saveWidgetRichContent':
          var $html = $('<div>' + $(element).html() + '</div>');

          Fliplet.Hooks.run('beforeSavePageContent', $html.html())
            .then(function (html) {
              if (!Array.isArray(html) || !html.length) {
                html = [$html.html()];
              }

              return html[html.length - 1];
            })
            .then(function (html) {
              $html = $('<div>' + html + '</div>');

              if (Fliplet.Helper) {
                Fliplet.Helper.restoreStateForHtml($html);
              }

              $html = replaceWidgetInstances($html);

              var htmlString = $html.html();

              data.html = htmlString;

              Fliplet.Studio.emit('page-saving');

              return Fliplet.API.request({
                url: 'v1/widget-instances/' + eventDetail.id,
                method: 'PUT',
                data: data
              })
            })
            .then(function () {
              // Emit event to Studio to get the updated DOM
              Fliplet.Studio.emit('update-dom');

              Fliplet.Studio.emit('page-saved');
            })
            .catch(function (error) {
              Fliplet.Studio.emit('page-saved', {
                isError: true,
                error: error
              });
            });
          break;
        default:
          break;
      }
    })
  }

  function initialize() {
    studioEventHandler();
  }
  

  return {
    initialize: initialize
  };
});