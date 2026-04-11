package com.navigatemama.core.data.firebase

import android.content.Context
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

object FirebaseProviders {
    fun isConfigured(context: Context): Boolean = FirebaseApp.getApps(context).isNotEmpty()

    fun authOrNull(context: Context): FirebaseAuth? {
        return if (isConfigured(context)) FirebaseAuth.getInstance() else null
    }

    fun firestoreOrNull(context: Context): FirebaseFirestore? {
        return if (isConfigured(context)) FirebaseFirestore.getInstance() else null
    }
}
