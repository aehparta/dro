import QtQuick 2.5
import QtMultimedia 5.12
import 'Cam.js' as CamJs
import 'Keys.js' as KeysJs


Rectangle {
    color: '#040'

    Keys.onPressed: (event) => KeysJs.cam(event)

    // Camera {
    //     id: camera
    // }

    // VideoOutput {
    //     source: camera
    //     anchors.fill: parent
    //     // orientation: 90
    // }

    // Canvas {
    //     id: canvas
    //     anchors.fill: parent
    //     onPaint: VisionJs.update(getContext('2d'))
    // }
}
