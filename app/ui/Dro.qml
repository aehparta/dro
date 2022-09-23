import QtQuick 2.5
import QtQuick.Layouts 1.0
import 'Keys.js' as KeysJs


Rectangle {
    color: '#040'

    Keys.onPressed: (event) => KeysJs.dro(event)

    GridLayout {
        columns: 2
        anchors.fill: parent
        anchors.margins: 10

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
}
