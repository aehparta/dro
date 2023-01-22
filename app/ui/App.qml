import QtQuick 2.5
import QtQuick.Controls 2.12
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
                model: [
                    { name: 'Config', key: 'F8' },
                    { name: 'Cam', key: 'F9' },
                    { name: 'DRO', key: 'F10' }
                ]
                BaseButton {
                    text: modelData.name
                    key: modelData.key
                    highlighted: viewName == modelData.name
                    onClicked: () => viewName = modelData.name
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

    Rectangle {
        property string title: 'empty'

        id: dialogDroDelete
        color: "#f00"
        visible: false
        anchors.fill: parent

        RowLayout {
            Label {
                text: parent.parent.title
                color: '#fff'
            }
        }

        Keys.onPressed: (event) => {
            switch (event.key) {
                case Qt.Key_Escape:
                    visible = false;
                    break;
            }
        }
    }

    Item {
        focus: true
        anchors.fill: parent
        Keys.onPressed: (event) => !dialogDroDelete.visible && Appjs.keys(event)
        Keys.forwardTo: [dialogDroDelete, dro, vision, config].find(e => e.visible) || []
    }

    Component.onCompleted: {
        window.visibility = fullscreen ? Window.FullScreen : Window.AutomaticVisibility;
        instrumentation.scan();
    }
}
