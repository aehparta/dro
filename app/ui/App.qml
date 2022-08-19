import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Dialogs 1.2
import QtQuick.Controls.Styles 1.4
import QtQuick.Layouts 1.0
import "."

ApplicationWindow {
    id: window
    visible: true
    width: 1024
    height: 600
    title: 'DRO'
    color: '#030'

    ColumnLayout {
        anchors.fill: parent

        RowLayout {
            Item {
                Layout.fillWidth: true
            }
            BaseButton {
                text: 'DRO'
                highlighted: view.currentIndex == 0
                onClicked: view.currentIndex = 0
            }
            BaseButton {
                text: 'Vision'
                highlighted: view.currentIndex == 1
                onClicked: view.currentIndex = 1
            }
        }

        SwipeView {
            id: view
            Layout.fillHeight: true
            Layout.fillWidth: true

            GridLayout {
                columns: 2

                /* X-axis */
                AxisValue {
                    id: axis_value_x
                    value: AxisReader.x

                    Layout.fillHeight: true
                    Layout.fillWidth: true
                }
                AxisLabel {
                    text: 'X'
                    target: axis_value_x
                }

                /* Y-axis */
                AxisValue {
                    id: axis_value_y
                    value: AxisReader.y

                    Layout.fillHeight: true
                    Layout.fillWidth: true
                }
                AxisLabel {
                    text: 'Y'
                    target: axis_value_y
                }

                /* Z-axis */
                AxisValue {
                    id: axis_value_z
                    value: AxisReader.z

                    Layout.fillHeight: true
                    Layout.fillWidth: true
                }
                AxisLabel {
                    text: 'Z'
                    target: axis_value_z
                }
            }

            Vision { }

        }
    }
}
