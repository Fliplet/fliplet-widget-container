var widgetId = Fliplet.Widget.getDefaultId();
var widgetData = Fliplet.Widget.getData(widgetId) || {};

function saveData() {
  Fliplet.Widget.save(widgetData)
    .then(function () {
      Fliplet.Widget.complete();
      Fliplet.Studio.emit('reload-widget-instance', widgetId);
    });
}

Fliplet.Widget.onSaveRequest(function () {
  saveData();
});
