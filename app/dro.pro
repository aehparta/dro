TEMPLATE = app

QT += core qml quick widgets serialport

SOURCES += src/main.cpp src/instrument.cpp src/instrumentation.cpp
HEADERS += src/instrument.h src/instrumentation.h
RESOURCES += ui/resources.qrc

CONFIG(debug, debug|release) {
    DESTDIR = build/debug
}
CONFIG(release, debug|release) {
    DESTDIR = build/release
}

OBJECTS_DIR = $$DESTDIR/.obj
MOC_DIR = $$DESTDIR/.moc
RCC_DIR = $$DESTDIR/.qrc
UI_DIR = $$DESTDIR/.u

