import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.0

Rectangle {
    color: '#040'

    Column {
        anchors.fill: parent
        anchors.margins: 10

        Repeater {
            model: instrumentation.controllers
            ColumnLayout {
                Label {
                    text: modelData.id
                    color: modelData.enabled ? '#7f7' : '#0c0'
                    font.pointSize: 16
                }
                Row {
                    CheckBox {
                        id: enabled
                        checked: modelData.enabled
                        checkable: false
                        height: 32
                        onClicked: modelData.enabled = !modelData.enabled;
                    }
                    ComboBox {
                        model: [ 115200, 230400 ]
                        currentIndex: model.indexOf(modelData.speed)
                        height: 32
                        font.pointSize: 18
                        onActivated: modelData.speed = currentText
                    }
                }
                Column {
                    Repeater {
                        model: modelData.instruments
                        Label {
                            color: '#7f7'
                            text: modelData.id
                        }
                    }
                }
            }
        }
    }
}
