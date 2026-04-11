# Add R8 keep rules when isMinifyEnabled = true (perplexity checklist #8).
# Firebase / Crashlytics — see https://firebase.google.com/docs/crashlytics/get-deobfuscated-reports
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
