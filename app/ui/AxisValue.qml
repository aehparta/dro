import QtQuick 2.5
import QtQuick.Controls 2.12

Label {
    property double value: 0
    property double offset: 0

    text: (value - offset).toFixed(3).padStart(9)

    color: '#0d0'

    horizontalAlignment: Text.AlignRight
    verticalAlignment: Text.AlignVCenter

    fontSizeMode: Text.Fit
    font.pointSize: 256
    font.bold: true

    background: Rectangle {
        color: '#050'
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            offset = value
        }
    }
}
