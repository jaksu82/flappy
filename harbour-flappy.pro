# NOTICE:
#
# Application name defined in TARGET has a corresponding QML filename.
# If name defined in TARGET is changed, the following needs to be done
# to match new name:
#   - corresponding QML filename must be changed
#   - desktop icon filename must be changed
#   - desktop filename must be changed
#   - icon definition filename in desktop file must be changed
#   - translation filenames have to be changed

# The name of your application
TARGET = harbour-flappy

CONFIG += sailfishapp

SOURCES += src/harbour-flappy.cpp

OTHER_FILES += qml/harbour-flappy.qml \
    qml/CoverPage.qml \
    qml/MainPage.qml \
    qml/MainDialog.qml \
    qml/engine.js \
    qml/img/*.png \
    qml/sound/*.wav \
    rpm/harbour-flappy.changes.in \
    rpm/harbour-flappy.spec \
    rpm/harbour-flappy.yaml \
    harbour-flappy.desktop

