
#include "instrument.h"
#include <QDebug>


Instrument::Instrument(QString id, int defaultValue, QObject *parent) : QObject(parent)
{
	m_id = id;
	m_value = defaultValue;
}

void Instrument::setValue(int value)
{
	if (m_value != value) {
		m_value = value;
		emit valueChanged();
	}
}

bool Instrument::operator==(const Instrument &other)
{
	return m_id == other.m_id;
}

QString Instrument::getId()
{
	return m_id;
}
