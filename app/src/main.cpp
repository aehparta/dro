
#include <QApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QFont>
#include "axis.h"


int main(int argc, char *argv[])
{
	QApplication app(argc, argv);
	QQmlApplicationEngine engine;

	/* setup app information */ QCoreApplication::setOrganizationName("Relec");
	QCoreApplication::setOrganizationDomain("relec.fi");
	QCoreApplication::setApplicationName("DRO");
	QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

	/* set fonts */
	QFont font("FreeMono", 24);
	font.setStyleHint(QFont::SansSerif);
	app.setFont(font);

	/* export axis to qml */
	Axis axis;
	engine.rootContext()->setContextProperty("AxisReader", &axis);

	/* load main view and run it */
	engine.load(QUrl(QStringLiteral("qrc:/App.qml")));
	return app.exec();
}
