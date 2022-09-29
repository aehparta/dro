#ifndef _CONTROLLER_H_
#define _CONTROLLER_H_

#include <QObject>
#include <QSerialPort>
#include <QList>
#include "instrument.h"


class Controller : public QObject
{
	Q_OBJECT
	Q_PROPERTY(QString id MEMBER m_id CONSTANT)
	Q_PROPERTY(bool enabled MEMBER m_enabled WRITE setEnabled NOTIFY enabledChanged)
	Q_PROPERTY(int speed MEMBER m_speed WRITE setSpeed NOTIFY speedChanged)
	Q_PROPERTY(QList<QObject *> instruments READ getInstrumentsAsQObjects NOTIFY instrumentsChanged)

	enum Type {
		SERIAL_PORT,
	};

  public:
	Controller(QString id, Type type, QString device = "", QObject *parent = NULL);

	bool operator==(const Controller &other);

	QString getId();
	Type getType();

	void setEnabled(bool enabled);
	void setSpeed(int speed);

	QList<Instrument *> getInstruments();
	QList<QObject *> getInstrumentsAsQObjects();

	static QList<Controller *> scan();

  signals:
	void enabledChanged();
	void speedChanged();
	void instrumentsChanged();

  private slots:
	void serialPortReadyRead();

  private:
	QString m_id;
	Type m_type;
	QString m_device;
	bool m_enabled;
	int m_speed;
	QList<Instrument *> m_instruments;

	QSerialPort port;

	bool start();
	bool stop();
	Instrument *findInstrument(QString id);
	Instrument *findOrCreateInstrument(QString id,
	                                   int defaultValue = 0,
	                                   QObject *parent = NULL);
};

#endif /* _CONTROLLER_H_ */
