#ifndef _SERIAL_PORT_H_
#define _SERIAL_PORT_H_

#include <QSerialPort>

class Axis : public QObject
{
	Q_OBJECT
	Q_PROPERTY(int x MEMBER m_x NOTIFY xChanged)
	Q_PROPERTY(int y MEMBER m_y NOTIFY yChanged)
	Q_PROPERTY(int z MEMBER m_z NOTIFY zChanged)

  public:
	Axis(QObject *parent = NULL);

  signals:
	void xChanged();
	void yChanged();
	void zChanged();

  private slots:
	void readyRead();

  private:
	int m_x;
	int m_y;
	int m_z;

	QSerialPort port;
};

#endif
