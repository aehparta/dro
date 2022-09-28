#ifndef _INSTRUMENTATION_H_
#define _INSTRUMENTATION_H_

#include <QSerialPort>
#include "instrument.h"


class Instrumentation : public QObject
{
	Q_OBJECT
	Q_PROPERTY(QList<QObject *> instruments MEMBER m_instruments NOTIFY instrumentsChanged)

  public:
	Instrumentation(QObject *parent = NULL);

	void operator+=(Instrument *instrument);
	void operator-=(Instrument *instrument);

  signals:
	void instrumentsChanged();

  private slots:
	void readyRead();

  private:
	QList<QObject *> m_instruments;

	QSerialPort port;
};

#endif /* _INSTRUMENTATION_H_ */
