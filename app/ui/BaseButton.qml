import QtQuick 2.5
import QtQuick.Controls 2.12

Button {
    padding: 4
    hoverEnabled: true
    background: Rectangle {
        anchors.fill: parent
        color: parent.highlighted ? '#070' : '#050'
        border.width: 2
        border.color: parent.hovered ? '#fff' : 'transparent'
    }
}
