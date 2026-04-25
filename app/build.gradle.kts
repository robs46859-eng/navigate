plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.google.services)
    alias(libs.plugins.firebase.crashlytics.gradle)
}

android {
    namespace = "com.navigatemama.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.navigatemama.app"
        minSdk = 29
        targetSdk = 36
        versionCode = 2
        versionName = "0.1.1-beta"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables.useSupportLibrary = true
        manifestPlaceholders["mapsApiKey"] = providers.gradleProperty("MAPS_API_KEY").orElse("").get()
    }

    signingConfigs {
        create("release") {
            val storeRel = providers.gradleProperty("NAVIGATE_RELEASE_STORE_FILE").orElse("").get()
            val storePw = providers.gradleProperty("NAVIGATE_RELEASE_STORE_PASSWORD").orElse("").get()
            val alias = providers.gradleProperty("NAVIGATE_RELEASE_KEY_ALIAS").orElse("").get()
            val keyPw = providers.gradleProperty("NAVIGATE_RELEASE_KEY_PASSWORD").orElse("").get()
            if (storeRel.isNotBlank() && storePw.isNotBlank() && alias.isNotBlank() && keyPw.isNotBlank()) {
                storeFile = rootProject.file(storeRel)
                storePassword = storePw
                keyAlias = alias
                keyPassword = keyPw
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            val releaseSigning = signingConfigs.findByName("release")
            if (releaseSigning?.storeFile != null && releaseSigning.storePassword != null &&
                releaseSigning.keyAlias != null && releaseSigning.keyPassword != null
            ) {
                signingConfig = releaseSigning
            }
        }
    }

    firebaseCrashlytics {
        nativeSymbolUploadEnabled = false
    }

    buildFeatures {
        buildConfig = true
        viewBinding = true
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_21
        targetCompatibility = JavaVersion.VERSION_21
    }

    kotlinOptions {
        jvmTarget = "21"
    }

    dynamicFeatures += setOf(":featurehealth", ":featurecommunity")
}

dependencies {
    implementation(project(":core-model"))
    implementation(project(":core-database"))
    implementation(project(":core-data"))
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.fragment)
    implementation(libs.androidx.lifecycle.livedata)
    implementation(libs.androidx.lifecycle.viewmodel)
    implementation(libs.androidx.lifecycle.runtime)
    implementation(libs.androidx.navigation.fragment)
    implementation(libs.androidx.navigation.ui)
    implementation(libs.androidx.recyclerview)
    implementation(libs.androidx.swiperefresh)
    implementation(libs.kotlinx.coroutines)
    implementation(libs.play.review)
    implementation(libs.play.app.update)
    implementation(libs.play.feature.delivery)
    implementation(libs.play.core.common)
    implementation(libs.play.services.maps)
    implementation(libs.play.services.location)
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.auth)
    implementation(libs.firebase.firestore)
    implementation(libs.firebase.crashlytics)
    implementation(libs.firebase.analytics)
    implementation(libs.j2objc.annotations)
}
