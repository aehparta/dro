
#include <QSerialPortInfo>
#include "controller.h"
#include "instrumentation.h"

#include <QDebug>


Instrumentation::Instrumentation(QObject *parent) : QObject(parent)
{
}

void Instrumentation::scan()
{
	QList<Controller *> scanned = Controller::scan();
	bool changed = controllers != scanned;

	for (int i = 0; i < scanned.length(); i++) {
		if (!hasController(scanned[i])) {
			controllers += scanned[i];
			connect(scanned[i], SIGNAL(instrumentsChanged()), this, SLOT(instrumentsUpdate()));
		}
		qDebug() << scanned[i]->getId();
	}

	if (changed) {
		emit controllersChanged();
		emit instrumentsChanged();
	}
}

bool Instrumentation::hasController(Controller *controller)
{
	for (int i = 0; i < controllers.length(); i++) {
		if (*controllers[i] == *controller) {
			return true;
		}
	}
	return false;
}

QList<QObject *> Instrumentation::getControllers()
{
	QList<QObject *> list;

	for (int i = 0; i < controllers.length(); i++) {
		list += controllers[i];
	}

	return list;
}

QList<QObject *> Instrumentation::getInstruments()
{
	QList<QObject *> list;

	for (int i = 0; i < controllers.length(); i++) {
		QList<Instrument *> instruments = controllers[i]->getInstruments();
		for (int j = 0; j < instruments.length(); j++) {
			list += instruments[j];
		}
	}

	return list;
}

void Instrumentation::instrumentsUpdate()
{
	emit instrumentsChanged();
}
