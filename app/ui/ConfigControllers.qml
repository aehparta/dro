import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.0
import Qt.labs.settings 1.0


ColumnLayout {
    Repeater {
        model: instrumentation.controllers
        Rectangle {
            Layout.fillWidth: true
            height: content.height + 20
            color: index == selectedController ? '#353' : '#050'
            border.color: index == selectedController ? '#ccc' : '#010'
            border.width: 1
            
            ColumnLayout {
                id: content
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.left: parent.left
                anchors.topMargin: 10
                anchors.leftMargin: 10
                anchors.rightMargin: 10

                Label {
                    text: modelData.id
                    color: modelData.enabled ? '#7f7' : '#0c0'
                    font.pointSize: 16
                }
                Row {
                    Switch {
                        id: enabled
                        position: modelData.enabled
                        checkable: false
                        height: 32
                        onClicked: modelData.enabled = !modelData.enabled;
                    }
                    ComboBox {
                        model: [ 115200, 230400 ]
                        currentIndex: model.indexOf(modelData.speed)
                        enabled: !modelData.enabled
                        height: 32
                        font.pointSize: 18
                        onActivated: modelData.speed = currentText
                    }
                }
                GridLayout {
                    Repeater {
                        model: modelData.instruments
                        Label {
                            Layout.row: index
                            Layout.column: 0
                            padding: 5
                            leftPadding: 10
                            rightPadding: 10
                            color: '#7f7'
                            text: 'Channel: ' + modelData.id
                            font.pointSize: 16
                            background: Rectangle {
                                color: '#060'
                                border.color: '#010'
                                border.width: 1
                            }
                        }
                    }
                    Repeater {
                        model: modelData.instruments
                        Label {
                            Layout.row: index
                            Layout.column: 1
                            padding: 5
                            leftPadding: 10
                            rightPadding: 10
                            color: '#7f7'
                            text: 'Value: ' + modelData.value
                            font.pointSize: 16
                            background: Rectangle {
                                color: '#060'
                                border.color: '#010'
                                border.width: 1
                            }
                        }
                    }
                }
            }
        }
    }
}