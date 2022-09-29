import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.0
import 'Keys.js' as KeysJs


Rectangle {
    property var name: ''
    property int value: 0
    property int offset: 0
    property string mode: 'view'
    property var zero: () => offset = value
    property var setMode: (v) => {
        if (v == 'edit') {
            editor.text = (value - offset) / 1000;
            editor.cursorVisible = true;
            mode = 'edit';
        } else {
            mode = v;
        }
    }
    property var onClicked: () => axisMode(this, 'edit')

    color: '#050'
    border.color: '#010'
    border.width: 1
    Layout.fillHeight: true
    Layout.fillWidth: true

    BaseValue {
        text: name
        color: '#090'
        verticalAlignment: Text.AlignTop
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        font.pointSize: 96
        leftPadding: 20
        rightPadding: 20
    }

    BaseValue {
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
        }
        BaseValue {
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

    Keys.onPressed: (event) => KeysJs.axis(event)
    Keys.forwardTo: [editor]
}
