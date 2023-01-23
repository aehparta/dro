import QtQuick 2.5
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.0
import Qt.labs.settings 1.0
import "."
import 'Config.js' as Configjs


Rectangle {
    property int tabIndex: 0
    property int selectedController: -1

    color: '#040'

    // Rectangle {
    //     id: tabsBackground
    //     color: '#030'
    //     anchors.fill: tabs
    // }

    ScrollView {
        anchors.fill: parent
        clip: true

        ColumnLayout {
            anchors.fill: parent

            RowLayout {
                id: tabs

                BaseButton {
                    text: 'Controllers'
                    color: highlighted ? '#fff' : '#aaa'
                    font.pointSize: 16
                    highlighted: tabIndex == 0
                    onClicked: () => tabIndex = 0
                }

                Repeater {
                    model: settings.dros
                    BaseButton {
                        text: modelData
                        color: highlighted ? '#fff' : '#aaa'
                        font.pointSize: 16
                        highlighted: tabIndex == index + 1
                        onClicked: () => tabIndex = index + 1
                    }
                }

                BaseButton {
                    text: '+'
                    color: highlighted ? '#fff' : '#aaa'
                    font.pointSize: 16
                    font.bold: true
                    highlighted: tabIndex == settings.dros.length + 1
                    onClicked: () => settings.dros = settings.dros.concat([Date.now()])
                }
            }

            ConfigControllers {
                visible: tabIndex == 0
            }
        }
    }
    
    Settings {
        id: settings
        property var dros: []
    }

    Keys.onPressed: (event) => Configjs.keys(event)
}
