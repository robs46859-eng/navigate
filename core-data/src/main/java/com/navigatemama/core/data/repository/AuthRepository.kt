package com.navigatemama.core.data.repository

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

class AuthRepository(
    private val auth: FirebaseAuth?
) {
    val isAvailable: Boolean
        get() = auth != null

    val currentUser: FirebaseUser?
        get() = auth?.currentUser

    fun addAuthStateListener(listener: FirebaseAuth.AuthStateListener) {
        auth?.addAuthStateListener(listener)
    }

    fun removeAuthStateListener(listener: FirebaseAuth.AuthStateListener) {
        auth?.removeAuthStateListener(listener)
    }

    suspend fun signInWithEmail(email: String, password: String) = withContext(Dispatchers.IO) {
        requireConfigured().signInWithEmailAndPassword(email.trim(), password).await()
    }

    suspend fun registerWithEmail(email: String, password: String) = withContext(Dispatchers.IO) {
        requireConfigured().createUserWithEmailAndPassword(email.trim(), password).await()
    }

    fun signOut() {
        auth?.signOut()
    }

    private fun requireConfigured(): FirebaseAuth {
        return requireNotNull(auth) { "Firebase Authentication is not configured for this build." }
    }
}
