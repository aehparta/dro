import QtQuick 2.5
import QtQuick.Controls 2.15

Label {
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
            console.log("clicked");
        }
    }
}
