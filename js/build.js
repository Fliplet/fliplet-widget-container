// Include your namespaced libraries
var coreLibrary = new Fliplet.Registry.get('container:1.0:core');

$('[data-widget-package="com.fliplet.container"]').each(function () {
  var widgetId = $(this).data('id');
  var data = Fliplet.Widget.getData(widgetId);

  // Create new widget library
  var containerCore = new coreLibrary(this, data);

  // Initialise the widget
  containerCore.initialize();
});