import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Dialogs 1.2
import QtQuick.Controls.Styles 1.4
import QtQuick.Layouts 1.0
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
                text: 'Vision'
                highlighted: view.currentIndex == 0
                onClicked: () => view.currentIndex = 0
            }
            BaseButton {
                text: 'DRO'
                highlighted: view.currentIndex == 1
                onClicked: () => view.currentIndex = 1
            }
        }

        SwipeView {
            id: view
            currentIndex: 1
            Layout.fillHeight: true
            Layout.fillWidth: true

            Vision {
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
        Keys.onPressed: (event) => KeysJs.main(event)
        Keys.forwardTo: [dro, vision]
    }
}
