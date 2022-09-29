import QtQuick 2.5
import QtQuick.Controls 2.12


Label {
    property var onClicked: () => { }

    horizontalAlignment: Text.AlignRight
    verticalAlignment: Text.AlignVCenter
    fontSizeMode: Text.Fit
    font.pointSize: 256
    font.bold: true

    MouseArea {
        anchors.fill: parent
        onClicked: parent.onClicked()
    }
}

