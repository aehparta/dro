
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
	m_running = false;

	setSpeed(settings.value("controller/" + m_id + "/speed", 0).toInt());
	setEnabled(settings.value("controller/" + m_id + "/enabled", false).toBool());
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
		settings.setValue("controller/" + m_id + "/enabled", m_enabled);
		emit enabledChanged();
	}
}

void Controller::setSpeed(int speed)
{
	if (m_speed != speed) {
		m_speed = speed;
		settings.setValue("controller/" + m_id + "/speed", m_speed);
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
	if (m_running) {
		qDebug() << "already running controller: " << m_id << m_device;
		return m_running;
	}

	if (m_type == SERIAL_PORT) {
		port.setPortName(m_device);
		port.setBaudRate(m_speed);
		if (!port.open(QIODevice::ReadOnly)) {
			qDebug() << "failed to open serial port: " << m_id << m_device << ", error: " << port.errorString();
			setEnabled(false);
			return false;
		}
		connect(&port, SIGNAL(readyRead()), this, SLOT(read()));
		m_running = true;
	} else if (m_type == DEMO_CONTROLLER) {
		qDebug() << "Demo controller started";
		connect(&timer, SIGNAL(timeout()), this, SLOT(read()));
		timer.start(1000);
		m_running = true;
	}

	return m_running;
}

bool Controller::stop()
{
	if (!m_running) {
		qDebug() << "not a running controller: " << m_id << m_device;
		return m_running;
	}

	if (m_type == SERIAL_PORT) {
		disconnect(&port, SIGNAL(readyRead()), this, SLOT(read()));
		port.close();
		m_instruments.clear();
		emit instrumentsChanged();
		m_running = false;
	} else if (m_type == DEMO_CONTROLLER) {
		qDebug() << "Demo controller stopped";
		timer.stop();
		m_running = false;
	}

	return m_running;
}

void Controller::read()
{
	if (!m_running) {
		qDebug() << "not a running controller: " << m_id << m_device;
		return;
	}

	if (m_type == SERIAL_PORT) {
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
	} else if (m_type == DEMO_CONTROLLER) {
		findOrCreateInstrument("0")->setValue(12340);
		findOrCreateInstrument("1")->setValue(45670);
		findOrCreateInstrument("3")->setValue(89000);
		findOrCreateInstrument("4")->setValue(rand() % 100);
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

	controllers += new Controller("Demo Controller", DEMO_CONTROLLER, "Demo Controller");

	return controllers;
}
