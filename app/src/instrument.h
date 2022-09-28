#ifndef _INSTRUMENT_H_
#define _INSTRUMENT_H_

#include <QObject>


class Instrument : public QObject
{
	Q_OBJECT
	Q_PROPERTY(QString id MEMBER m_id CONSTANT)
	Q_PROPERTY(int value MEMBER m_value NOTIFY valueChanged)

  public:
	Instrument(QString id, int defaultValue = 0, QObject *parent = NULL);

	void operator=(int value);
	bool operator==(const Instrument &other);

  signals:
	void valueChanged();

  private:
	QString m_id;
	int m_value;
};

#endif /* _INSTRUMENT_H_ */
