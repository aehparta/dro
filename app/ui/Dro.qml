import QtQuick 2.5
import QtQuick.Layouts 1.0
import "."
import 'Dro.js' as DroJs
import 'Keys.js' as KeysJs


Rectangle {
    color: '#040'

    property var axisEdit: (axis) => {
        x.setMode();
        y.setMode();
        z.setMode();
        a.setMode();
        b.setMode();
        axis.setMode('edit');
    }

    GridLayout {
        columns: 2
        anchors.fill: parent
        anchors.margins: 10
        Repeater {
            model: instrumentation.instruments
            AxisValue {
                Layout.row: index
                Layout.column: 0
                // id: modelData.id
                value: modelData.value
            }
        }
        Repeater {
            model: instrumentation.instruments
            AxisLabel {
                Layout.row: index
                Layout.column: 1
                text: modelData.id
                // target: modelData.id
            }
        }
    }

    Keys.onPressed: (event) => KeysJs.dro(event)
    // Keys.forwardTo: [x, y, z, a, b].filter(e => e.mode == 'edit')
}
