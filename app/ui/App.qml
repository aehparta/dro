import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Dialogs 1.2
import QtQuick.Controls.Styles 1.4
import QtQuick.Layouts 1.0
import QtQuick.Window 2.11
import "."
import 'App.js' as Appjs


ApplicationWindow {
    property string viewName: 'Config'
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

            Repeater {
                model: ['Config', 'Cam', 'DRO']
                BaseButton {
                    text: modelData
                    highlighted: viewName == modelData
                    onClicked: () => viewName = modelData
                }
            }
        }

        Config {
            id: config
            visible: viewName == 'Config'
            Layout.fillWidth: true
            Layout.fillHeight: true
        }
        Cam {
            id: vision
            visible: viewName == 'Cam'
            Layout.fillWidth: true
            Layout.fillHeight: true
        }
        Dro {
            id: dro
            visible: viewName == 'DRO'
            Layout.fillWidth: true
            Layout.fillHeight: true
        }
    }

    Item {
        focus: true
        anchors.fill: parent
        Keys.onPressed: (event) => Appjs.keys(event)
        Keys.forwardTo: [dro, vision, config].filter(e => e.visible)
    }

    Component.onCompleted: {
        window.visibility = fullscreen ? Window.FullScreen : Window.AutomaticVisibility;
        instrumentation.scan();
    }
}
