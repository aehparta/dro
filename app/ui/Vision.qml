import QtQuick 2.5
import QtMultimedia 5.12
import 'Vision.js' as VisionJs

Item {
    focus: true
    
    Camera {
        id: camera
    }

    VideoOutput {
        source: camera
        anchors.fill: parent
        // orientation: 90
        Keys.onPressed: console.log('vressed')
    }

    Canvas {
        id: canvas
        anchors.fill: parent
        onPaint: VisionJs.update(getContext('2d'))
        Keys.onPressed: console.log('cressed')
    }

    Keys.onPressed: console.log('ressed')
}

