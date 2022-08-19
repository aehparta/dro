#ifndef _SERIAL_PORT_H_
#define _SERIAL_PORT_H_

#include <QSerialPort>

class Axis : public QObject
{
	Q_OBJECT
	Q_PROPERTY(int x MEMBER m_x NOTIFY xChanged)
	Q_PROPERTY(int x_offset MEMBER m_x_offset NOTIFY xOffsetChanged)
	Q_PROPERTY(int y MEMBER m_y NOTIFY yChanged)
	Q_PROPERTY(int y_offset MEMBER m_y_offset NOTIFY yOffsetChanged)
	Q_PROPERTY(int z MEMBER m_z NOTIFY zChanged)
	Q_PROPERTY(int z_offset MEMBER m_z_offset NOTIFY zOffsetChanged)

  public:
	Axis(QObject *parent = NULL);

  signals:
	void xChanged();
	void xOffsetChanged();
	void yChanged();
	void yOffsetChanged();
	void zChanged();
	void zOffsetChanged();

  private slots:
	void readyRead();

  private:
	int m_x;
	int m_x_offset;
	int m_y;
	int m_y_offset;
	int m_z;
	int m_z_offset;

	QSerialPort port;
};

#endif
