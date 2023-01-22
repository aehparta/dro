import QtQuick 2.5
import QtQuick.Controls 2.12

Label {
    property var key: false
    property bool highlighted: false
    property var onClicked

    color: '#fff'
    padding: 10
    topPadding: key !== false ? keyLabel.height : 10
    
    Label {
        id: keyLabel
        visible: key !== false
        text: key
        color: '#c00'
        padding: 2
        leftPadding: 10
        font.bold: true
        font.pointSize: 16
    }

    background: Rectangle {
        anchors.fill: parent
        color: parent.highlighted ? '#040' : 'transparent'
    }

    MouseArea {
        anchors.fill: parent
        onClicked: parent.onClicked()
    }
}
