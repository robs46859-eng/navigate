#!/bin/sh

APP_HOME=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
CLASSPATH="$APP_HOME/gradle/wrapper/gradle-wrapper.jar"

if [ -n "$JAVA_HOME" ] ; then
    JAVA_EXE="$JAVA_HOME/bin/java"
else
    JAVA_EXE="/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/java"
fi

exec "$JAVA_EXE" -Xmx6g -Dfile.encoding=UTF-8 -classpath "$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "$@"
