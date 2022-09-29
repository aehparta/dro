function keys(event) {
  switch (event.key) {
    case Qt.Key_Up:
      if (selectedController > -1) {
        selectedController--;
      }
      break;
    case Qt.Key_Down:
      if (selectedController < instrumentation.controllers.length - 1) {
        selectedController++;
      }
      break;
    case Qt.Key_Left:
      if (selectedController < 0 && tabIndex > 0) {
        tabIndex--;
      }
      break;
    case Qt.Key_Right:
      if (selectedController < 0 && tabIndex < settings.dros.length + 1) {
        tabIndex++;
      }
      break;
    case Qt.Key_Enter:
    case Qt.Key_Return:
      if (selectedController < 0 && tabIndex == settings.dros.length + 1) {
        settings.dros = settings.dros.concat([Date.now()]);
      }
      break;
  }

  if (
    selectedController < 0 ||
    selectedController >= instrumentation.controllers.length
  ) {
    return;
  }

  switch (event.key) {
    case Qt.Key_Enter:
    case Qt.Key_Return:
      instrumentation.controllers[selectedController].enabled =
        !instrumentation.controllers[selectedController].enabled;
      break;
    case Qt.Key_Left:
      if (
        !instrumentation.controllers[selectedController].enabled &&
        instrumentation.controllers[selectedController].speed > 115200
      ) {
        instrumentation.controllers[selectedController].speed /= 2;
      }
      break;
    case Qt.Key_Right:
      if (
        !instrumentation.controllers[selectedController].enabled &&
        instrumentation.controllers[selectedController].speed < 230400
      ) {
        instrumentation.controllers[selectedController].speed *= 2;
      }
      break;
  }
}
