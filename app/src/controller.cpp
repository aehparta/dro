
#include <QSerialPortInfo>
#include <QRegularExpression>
#include "controller.h"

#include <QDebug>


Controller::Controller(QString id, Type type, QString device, QObject *parent) : QObject(parent)
{
	m_id = id;
	m_type = type;
	m_device = device;
	m_enabled = false;
	m_speed = 0;
}

bool Controller::operator==(const Controller &other)
{
	return m_id == other.m_id;
}

QString Controller::getId()
{
	return m_id;
}

Controller::Type Controller::getType()
{
	return m_type;
}

void Controller::setEnabled(bool enabled)
{
	if (m_enabled != enabled) {
		m_enabled = enabled ? start() : stop();
		emit enabledChanged();
	}
}

void Controller::setSpeed(int speed)
{
	if (m_speed != speed) {
		m_speed = speed;
		emit speedChanged();
	}
}

QList<Instrument *> Controller::getInstruments()
{
	return m_instruments;
}

QList<QObject *> Controller::getInstrumentsAsQObjects()
{
	QList<QObject *> list;

	for (int i = 0; i < m_instruments.length(); i++) {
		list += m_instruments[i];
	}

	return list;
}

bool Controller::start()
{
	if (m_type == SERIAL_PORT) {
		port.setPortName(m_device);
		port.setBaudRate(m_speed);
		if (!port.open(QIODevice::ReadOnly)) {
			qDebug() << "failed to open serial port: " << m_device << ", error: " << port.errorString();
			return false;
		}
		connect(&port, SIGNAL(readyRead()), this, SLOT(serialPortReadyRead()));
	}
	return true;
}

bool Controller::stop()
{
	if (m_type == SERIAL_PORT) {
		disconnect(&port, SIGNAL(readyRead()), this, SLOT(serialPortReadyRead()));
		port.close();
		m_instruments.clear();
		emit instrumentsChanged();
	}
	return false;
}

void Controller::serialPortReadyRead()
{
	while (port.canReadLine()) {
		QByteArray data = port.readLine();
		QRegularExpression re("^([0-9a-zA-Z]+):(-?[0-9]+)\r?\n");
		QRegularExpressionMatch match = re.match(data.constData());
		if (match.hasMatch()) {
			QString axis = match.captured(1);
			int value = match.captured(2).toInt();
			findOrCreateInstrument(axis)->setValue(value);
		}
	}
}

Instrument *Controller::findInstrument(QString id)
{
	for (int i = 0; i < m_instruments.length(); i++) {
		if (m_instruments[i]->getId() == id) {
			return m_instruments[i];
		}
	}
	return NULL;
}

Instrument *Controller::findOrCreateInstrument(QString id,
                                               int defaultValue,
                                               QObject *parent)
{
	Instrument *instrument = findInstrument(id);
	if (!instrument) {
		instrument = new Instrument(id, defaultValue, parent);
		m_instruments += instrument;
		emit instrumentsChanged();
	}
	return instrument;
}

QList<Controller *> Controller::scan()
{
	QList<Controller *> controllers;

	QList<QSerialPortInfo> serialPorts = QSerialPortInfo::availablePorts();
	for (int i = 0; i < serialPorts.length(); i++) {
		QString id = serialPorts[i].serialNumber() + " " +
		             serialPorts[i].portName() + " " +
		             serialPorts[i].description();
		controllers += new Controller(id.trimmed(), SERIAL_PORT, serialPorts[i].portName());
	}

	return controllers;
}
