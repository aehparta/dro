
#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QFont>
#include <QCommandLineParser>
#include "instrumentation.h"

#include <QDebug>
#include <QSerialPortInfo>


QCommandLineOption opt_fullscreen("f", "Start in fullscreen");


int main(int argc, char *argv[])
{
	/* setup app information */
	QCoreApplication::setOrganizationName("Relec");
	QCoreApplication::setOrganizationDomain("relec.fi");
	QCoreApplication::setApplicationName("DRO");
	QCoreApplication::setApplicationVersion("1.0.0");
	QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

	/* basic app creation */
	QApplication app(argc, argv);
	QQmlApplicationEngine engine;

	/* command line options */
	QCommandLineParser parser;
	parser.setApplicationDescription("DRO");
	parser.addHelpOption();
	parser.addVersionOption();
	parser.addOption(opt_fullscreen);
	parser.process(app);

	/* set fonts */
	QFont font("FreeMono", 24);
	font.setStyleHint(QFont::SansSerif);
	app.setFont(font);

	/* export options to qml */
	engine.rootContext()->setContextProperty("fullscreen", parser.isSet(opt_fullscreen));

	/* export instrumentation to qml */
	Instrumentation instrumentation;
	Instrument *instrument;
	instrument = new Instrument("X");
	instrumentation += instrument;
	instrument = new Instrument("Y");
	instrumentation += instrument;
	instrument = new Instrument("Z");
	instrumentation += instrument;
	engine.rootContext()->setContextProperty("instrumentation", &instrumentation);

	QList<QSerialPortInfo> ports = QSerialPortInfo::availablePorts();
	for (int i = 0; i < ports.length(); i++) {
		qDebug() << ports[i].portName();
		qDebug() << ports[i].description();
		qDebug() << ports[i].serialNumber();
	}

	QList<qint32> baudRates = QSerialPortInfo::standardBaudRates();
	for (int i = 0; i < baudRates.length(); i++) {
		qDebug() << baudRates[i];
	}

	/* load main view and run it */
	engine.load(QUrl(QStringLiteral("qrc:/App.qml")));
	return app.exec();
}
