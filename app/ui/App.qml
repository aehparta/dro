import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Dialogs 1.2
import QtQuick.Controls.Styles 1.4
import QtQuick.Layouts 1.0
import QtQuick.Window 2.11
import "."
import 'Keys.js' as KeysJs


ApplicationWindow {
    id: window
    visible: true
    width: 1024
    height: 600
    title: 'DRO'
    color: '#020'

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        RowLayout {
            Item {
                Layout.fillWidth: true
            }

            BaseButton {
                text: 'Scan'
                onClicked: () => {
                instrumentation.scan();
                console.log(instrumentation.controllers);
                }
            }

            BaseButton {
                text: 'Start all'
                onClicked: () => {
                    for (let i = 0; i < instrumentation.controllers.length; i++) {
                        console.log('start', instrumentation.controllers[i]);
                        instrumentation.controllers[i].speed = 115200;
                        instrumentation.controllers[i].enabled = true;
                    }
                }
            }

            Repeater {
                model: ['Config', 'Cam', 'DRO']
                BaseButton {
                    text: modelData
                    highlighted: view.currentIndex == model.index
                    onClicked: () => view.currentIndex = model.index
                }
            }
        }

        SwipeView {
            id: view
            currentIndex: 0 //count - 1
            Layout.fillHeight: true
            Layout.fillWidth: true

            Config {
                id: config
            }
            Cam {
                id: vision
            }
            Dro {
                id: dro
            }
        }
    }

    Item {
        focus: true
        anchors.fill: parent
        Keys.onPressed: (event) => KeysJs.common(event)
        Keys.forwardTo: [view.currentItem]
    }

    Component.onCompleted: {
        window.visibility = fullscreen ? Window.FullScreen : Window.AutomaticVisibility;
        instrumentation.scan();
    }
}
