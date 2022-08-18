
#include "axis.h"
#include <QDebug>


Axis::Axis(QObject *parent) : QObject(parent)
{
	m_x = 0;
	m_y = 1;
	m_z = 2;

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
				m_x = (double)value / 1000.0L;
				emit xChanged();
				break;
			case 'Y':
				m_y = (double)value / 1000.0L;
				emit yChanged();
				break;
			case 'Z':
				m_z = (double)value / 1000.0L;
				emit zChanged();
				break;
			}
		}
	}
}