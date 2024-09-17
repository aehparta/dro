import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.0
import 'Axis.js' as Axisjs


Rectangle {
    property int index: 0
    property int value: 0
    property int offset: 0
    property string mode: 'view'
    property var zero: () => offset = value
    property var setMode: (newMode) => {
        if (newMode == 'edit') {
            let v = (value - offset) / 1000
            editor.text = v == 0 ? '' : v;
            editor.cursorVisible = true;
            mode = 'edit';
        } else {
            mode = newMode;
        }
    }
    property var onClicked: () => axisMode(this, 'edit')

    color: '#050'
    border.color: '#010'
    border.width: 1
    Layout.fillHeight: true
    Layout.fillWidth: true

    Value {
        text: ['X', 'Y', 'Z', 'A', 'B', 'C', 'D', 'E', 'F'][index]
        color: '#090'
        verticalAlignment: Text.AlignTop
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        font.pointSize: 96
        leftPadding: 20
        rightPadding: 20
    }

    Value {
        anchors.fill: parent
        visible: mode == 'view'

        text: ((value - offset) / 1000).toFixed(3).padStart(9)
        color: '#0d0'
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: -1
        visible: mode == 'edit'

        TextField {
            id: editor
            text: ''
            color: '#cfc'
            Layout.fillHeight: true
            Layout.fillWidth: true
            activeFocusOnPress: false

            horizontalAlignment: Text.AlignRight
            font.pointSize: 0.4 * parent.height || 1
            font.bold: true

            background: Rectangle {
                color: '#373'
                border.color: '#010'
                border.width: 1
            }

            Keys.onPressed: (event) => Axisjs.keypress_editor(event)
        }
        Value {
            id: result
            text: '= ' + (eval(editor.text) || '0')
            color: '#0d0'
            Layout.fillHeight: true
            Layout.fillWidth: true

            font.pointSize: 0.3 * parent.height || 1

            background: Rectangle {
                color: '#050'
                border.color: '#010'
                border.width: 1
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: parent.onClicked()
    }

    Keys.onPressed: (event) => Axisjs.keypress(event)
    Keys.forwardTo: [editor]
}
