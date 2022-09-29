
#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QFont>
#include <QCommandLineParser>
#include <QStyleFactory>
#include "instrumentation.h"


QCommandLineOption opt_fullscreen("f", "Start in fullscreen");
QCommandLineOption opt_demo("d", "Run in demo mode");


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
	parser.addOption(opt_demo);
	parser.process(app);

	/* set fonts */
	QFont font("FreeMono", 24);
	font.setStyleHint(QFont::SansSerif);
	app.setFont(font);

	/* export options to qml */
	engine.rootContext()->setContextProperty("fullscreen", parser.isSet(opt_fullscreen));
	engine.rootContext()->setContextProperty("demo", parser.isSet(opt_demo));

	/* export instrumentation to qml */
	Instrumentation instrumentation;
	if (parser.isSet(opt_demo)) {
		// Instrument *instrument;
		// instrument = new Instrument("ttyUSB99 0");
		// instrumentation += instrument;
		// instrument = new Instrument("ttyUSB99 1");
		// instrumentation += instrument;
		// instrument = new Instrument("ttyUSB99 2");
		// instrumentation += instrument;
	}
	engine.rootContext()->setContextProperty("instrumentation", &instrumentation);

	/* load main view and run it */
	engine.load(QUrl(QStringLiteral("qrc:/App.qml")));
	return app.exec();
}
