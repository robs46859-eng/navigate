package com.navigatemama.core.data.repository

import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

class AuthRepository(
    private val auth: FirebaseAuth
) {
    val authState get() = auth

    suspend fun signInWithEmail(email: String, password: String) = withContext(Dispatchers.IO) {
        auth.signInWithEmailAndPassword(email.trim(), password).await()
    }

    suspend fun registerWithEmail(email: String, password: String) = withContext(Dispatchers.IO) {
        auth.createUserWithEmailAndPassword(email.trim(), password).await()
    }

    fun signOut() {
        auth.signOut()
    }
}
