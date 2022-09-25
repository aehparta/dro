import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.0
import 'Keys.js' as KeysJs


Rectangle {
    property int value: 0
    property int offset: 0
    property var zero: () => offset = value
    property string mode: 'view'

    color: '#050'
    border.color: '#010'
    border.width: 1

    BaseValue {
        anchors.fill: parent
        visible: mode == 'view'

        text: ((value - offset) / 1000).toFixed(3).padStart(9)
        color: '#0d0'

        onClicked: () => {
            editor.text = (value - offset) / 1000;
            editor.cursorVisible = true;
            mode = 'edit';
        }
    }

    ColumnLayout {
        anchors.fill: parent
        visible: mode == 'edit'

        TextInput {
            id: editor
            text: ''
            color: '#cfc'
            Layout.fillHeight: true
            Layout.fillWidth: true
            activeFocusOnPress: false

            // background: Rectangle {
            //     color: '#373'
            //     border.color: '#010'
            //     border.width: 1
            // }
        }
        BaseValue {
            id: result
            text: '= ' + (eval(editor.text) || '0')
            color: '#7a7'
            Layout.fillHeight: true
            Layout.fillWidth: true

            background: Rectangle {
                color: '#050'
                border.color: '#010'
                border.width: 1
            }
        }
    }

    Keys.onPressed: (event) => KeysJs.values(event)
    Keys.forwardTo: [editor]
}
