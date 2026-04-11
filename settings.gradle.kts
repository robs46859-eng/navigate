pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "navigate"

include(":app")
include(":core-model")
include(":core-database")
include(":core-data")
include(":featurehealth")
include(":featurecommunity")
