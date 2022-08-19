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
            Button {
                text: 'DRO'
                onClicked: view.currentIndex = 0
            }
            Button {
                text: 'Vision'
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
                    value: AxisReader.x - AxisReader.x_offset

                    Layout.fillHeight: true
                    Layout.fillWidth: true
                }
                AxisLabel {
                    text: 'X'
                }

                /* Y-axis */
                AxisValue {
                    value: AxisReader.y - AxisReader.y_offset

                    Layout.fillHeight: true
                    Layout.fillWidth: true
                }
                AxisLabel {
                    text: 'Y'
                }

                /* Z-axis */
                AxisValue {
                    value: AxisReader.z - AxisReader.z_offset

                    Layout.fillHeight: true
                    Layout.fillWidth: true
                }
                AxisLabel {
                    text: 'Z'
                }
            }

            Vision { }

        }
    }
}
