import QtQuick 2.5
import QtQuick.Controls 2.12

Label {
    property bool highlighted: false
    property var onClicked

    color: '#fff'
    padding: 10
    
    background: Rectangle {
        anchors.fill: parent
        color: parent.highlighted ? '#040' : 'transparent'
    }

    MouseArea {
        anchors.fill: parent
        onClicked: parent.onClicked()
    }
}
