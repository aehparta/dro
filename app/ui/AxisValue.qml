import QtQuick 2.5
import QtQuick.Controls 2.12

Label {
    property int value: 0
    property int offset: 0
    property var zero: () => offset = value

    text: ((value - offset) / 1000).toFixed(3).padStart(9)

    color: '#0d0'

    horizontalAlignment: Text.AlignRight
    verticalAlignment: Text.AlignVCenter

    fontSizeMode: Text.Fit
    font.pointSize: 256
    font.bold: true

    background: Rectangle {
        color: '#050'
        border.color: '#010'
        border.width: 1
    }
}
