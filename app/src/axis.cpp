
#include "axis.h"
#include <QDebug>


Axis::Axis(QObject *parent) : QObject(parent)
{
	m_x = 0;
	m_x_offset = 0;
	m_y = 0;
	m_y_offset = 0;
	m_z = 0;
	m_z_offset = 0;

	port.setPortName("/dev/ttyUSB0");
	port.setBaudRate(115200);
	if (!port.open(QIODevice::ReadOnly)) {
		qDebug() << "failed to open serial port: " << port.errorString() << "\n";
	}

	connect(&port, SIGNAL(readyRead()), this, SLOT(readyRead()));
}

void Axis::readyRead()
{
	if (port.canReadLine()) {
		char *data = port.readLine().data();
		int value;
		char axis;
		int n = sscanf(data, "%c:%d", &axis, &value);
		if (n == 2) {
			switch (axis) {
			case 'X':
				if (m_x != value) {
					m_x = value;
					emit xChanged();
				}
				break;
			case 'Y':
				if (m_y != value) {
					m_y = value;
					emit yChanged();
				}
				break;
			case 'Z':
				if (m_z != value) {
					m_z = value;
					emit zChanged();
				}
				break;
			}
		}
	}
}