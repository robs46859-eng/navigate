package com.navigatemama.app.location

import android.content.Context

internal object LocationEducationPrefs {
    private const val PREFS = "navigate_location_education"
    private const val KEY_SEEN = "seen_location_education"

    fun hasSeen(context: Context): Boolean =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getBoolean(KEY_SEEN, false)

    fun markSeen(context: Context) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putBoolean(KEY_SEEN, true)
            .apply()
    }
}
