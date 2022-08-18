#ifndef _SERIAL_PORT_H_
#define _SERIAL_PORT_H_

#include <QSerialPort>

class Axis : public QObject
{
	Q_OBJECT
	Q_PROPERTY(double x MEMBER m_x NOTIFY xChanged)
	Q_PROPERTY(double y MEMBER m_y NOTIFY yChanged)
	Q_PROPERTY(double z MEMBER m_z NOTIFY zChanged)

  public:
	Axis(QObject *parent = NULL);

  signals:
	void xChanged();
	void yChanged();
	void zChanged();

  private slots:
	void readyRead();

  private:
	double m_x;
	double m_y;
	double m_z;

	QSerialPort port;
};

#endif
