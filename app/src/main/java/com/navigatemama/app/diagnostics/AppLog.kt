package com.navigatemama.app.diagnostics

import android.util.Log

/**
 * Perplexity checklist #13 — single tag for logcat: `adb logcat -s NavigateMama`
 */
object AppLog {
    const val TAG = "NavigateMama"

    fun d(message: String) = Log.d(TAG, message)
    fun i(message: String) = Log.i(TAG, message)
    fun w(message: String, t: Throwable? = null) =
        if (t != null) Log.w(TAG, message, t) else Log.w(TAG, message)

    fun e(message: String, t: Throwable? = null) =
        if (t != null) Log.e(TAG, message, t) else Log.e(TAG, message)
}
