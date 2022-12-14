import QtQuick 2.5
import QtQuick.Layouts 1.0
import "."
import 'Dro.js' as Drojs


Rectangle {
    color: '#040'
    property var keyForwards: []

    property var axisMode: (axis, mode) => {
        for (let i = 0; i < axes.count; i++) {
            axes.itemAt(i).setMode('view')
        }

        if (typeof axis == 'number') {
            axis = axes.itemAt(axis);
        }
        if (axis) {
            axis.setMode(mode);
            keyForwards = mode != 'view' ? [axis] : [];
        }
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 10
        Repeater {
            id: axes
            model: instrumentation.instruments
            Axis {
                index: model.index
                value: modelData.value
            }
        }
    }

    Keys.onPressed: (event) => Drojs.keys(event)
    Keys.forwardTo: keyForwards
}
