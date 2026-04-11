package com.navigatemama.app.shared

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.IntentSenderRequest
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.UpdateAvailability
import com.google.android.play.core.review.ReviewManagerFactory
import com.google.android.play.core.splitinstall.SplitInstallManager
import com.google.android.play.core.splitinstall.SplitInstallManagerFactory
import com.google.android.play.core.splitinstall.SplitInstallRequest

class InAppReviewCoordinator(context: Context) {
    private val reviewManager = ReviewManagerFactory.create(context)

    fun launch(activity: Activity) {
        reviewManager.requestReviewFlow().addOnSuccessListener { info ->
            reviewManager.launchReviewFlow(activity, info)
        }
    }
}

class InAppUpdateCoordinator(context: Context) {
    private val appUpdateManager: AppUpdateManager = AppUpdateManagerFactory.create(context)

    fun maybeStartFlexibleUpdate(
        activity: Activity,
        launcher: ActivityResultLauncher<IntentSenderRequest>
    ) {
        appUpdateManager.appUpdateInfo.addOnSuccessListener { info ->
            if (info.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE &&
                info.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)
            ) {
                appUpdateManager.startUpdateFlowForResult(
                    info,
                    launcher,
                    com.google.android.play.core.appupdate.AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build()
                )
            }
        }
    }
}

class DynamicFeatureCoordinator(private val context: Context) {
    private val splitInstallManager: SplitInstallManager = SplitInstallManagerFactory.create(context)

    fun isInstalled(moduleName: String): Boolean = splitInstallManager.installedModules.contains(moduleName)

    fun openOrInstallCommunity(activity: Activity) {
        val moduleName = "featurecommunity"
        if (isInstalled(moduleName)) {
            activity.startActivity(Intent("com.navigatemama.featurecommunity.OPEN"))
            return
        }
        val request = SplitInstallRequest.newBuilder().addModule(moduleName).build()
        splitInstallManager.startInstall(request)
            .addOnSuccessListener {
                activity.startActivity(Intent("com.navigatemama.featurecommunity.OPEN"))
            }
            .addOnFailureListener {
                Toast.makeText(context, "Community module download failed.", Toast.LENGTH_SHORT).show()
            }
    }

    fun openHealth(activity: Activity) {
        activity.startActivity(Intent("com.navigatemama.featurehealth.OPEN"))
    }
}
