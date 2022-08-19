import QtQuick 2.5
import QtQuick.Controls 2.12

Row {
    property string text: ''

    Label {
        text: parent.text
        color: '#090'

        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter

        fontSizeMode: Text.Fit
        font.pointSize: 72
        font.bold: true

        leftPadding: 20
        rightPadding: 20

        MouseArea {
            anchors.fill: parent
            onClicked: {
                if (text == 'X') {
                    AxisReader.x_offset = AxisReader.x;
                } else if (text == 'Y') {
                    AxisReader.y_offset = AxisReader.y;
                } else if (text == 'Z') {
                    AxisReader.z_offset = AxisReader.z;
                }
            }
        }
    }
}