package com.navigatemama.app.onboarding

import android.content.Context

internal object OnboardingPreferences {
    private const val PREFS = "navigate_mama_onboarding"
    private const val KEY_COMPLETE = "onboarding_complete"

    fun isComplete(context: Context): Boolean =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getBoolean(KEY_COMPLETE, false)

    fun setComplete(context: Context) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putBoolean(KEY_COMPLETE, true)
            .apply()
    }
}
