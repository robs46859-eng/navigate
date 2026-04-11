package com.navigatemama.app

import android.app.Application
import android.content.Context
import com.google.android.play.core.splitcompat.SplitCompat
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.navigatemama.app.diagnostics.AppLog
import com.navigatemama.app.shared.ServiceLocator
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class NavigateMamaApp : Application() {
    private val appScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var lastFirebaseUid: String? = null

    override fun attachBaseContext(base: Context) {
        super.attachBaseContext(base)
        SplitCompat.install(this)
    }

    override fun onCreate() {
        super.onCreate()
        runCatching { FirebaseApp.initializeApp(this) }
        runCatching {
            FirebaseCrashlytics.getInstance().setCrashlyticsCollectionEnabled(true)
        }
        AppLog.i("Navigate Mama starting (perplexity checklist: Crashlytics enabled)")

        val auth = runCatching { FirebaseAuth.getInstance() }.getOrNull() ?: return
        lastFirebaseUid = auth.currentUser?.uid

        auth.addAuthStateListener { firebaseAuth ->
            val uid = firebaseAuth.currentUser?.uid
            appScope.launch {
                withContext(Dispatchers.IO) {
                    val profileRepo = ServiceLocator.profileRepository(this@NavigateMamaApp)
                    when {
                        uid != null -> {
                            lastFirebaseUid = uid
                            firebaseAuth.currentUser?.let { user ->
                                profileRepo.syncFromFirestoreIfNeeded(user)
                            }
                        }
                        lastFirebaseUid != null -> {
                            lastFirebaseUid = null
                            profileRepo.onSignedOut()
                        }
                    }
                }
            }
        }
    }
}
