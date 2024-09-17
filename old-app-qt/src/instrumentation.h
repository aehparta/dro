#ifndef _INSTRUMENTATION_H_
#define _INSTRUMENTATION_H_

#include "instrument.h"
#include "controller.h"


class Instrumentation : public QObject
{
	Q_OBJECT
	Q_PROPERTY(QList<QObject *> controllers READ getControllers NOTIFY controllersChanged)
	Q_PROPERTY(QList<QObject *> instruments READ getInstruments NOTIFY instrumentsChanged)

  public:
	Instrumentation(QObject *parent = NULL);

	void operator+=(Instrument *instrument);
	void operator-=(Instrument *instrument);

	Q_INVOKABLE void scan();
	QList<QObject *> getControllers();
	QList<QObject *> getInstruments();

  signals:
	void controllersChanged();
	void instrumentsChanged();


  private slots:
	void instrumentsUpdate();

  private:
	QList<Controller *> controllers;

	bool hasController(Controller *controller);
};

#endif /* _INSTRUMENTATION_H_ */
