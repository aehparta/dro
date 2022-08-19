import QtQuick 2.5
import QtQuick.Controls 2.12

Label {
    property var target

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
        onClicked: target.offset = target.value
    }
}
