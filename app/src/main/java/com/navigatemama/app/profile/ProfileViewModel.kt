package com.navigatemama.app.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseUser
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.UserProfile
import kotlinx.coroutines.launch

class ProfileViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ServiceLocator.profileRepository(application)
    private val authRepository = ServiceLocator.authRepository(application)

    private val _firebaseUser = MutableLiveData<FirebaseUser?>(authRepository.currentUser)
    private val authListener = com.google.firebase.auth.FirebaseAuth.AuthStateListener { auth ->
        _firebaseUser.postValue(auth.currentUser)
    }

    init {
        authRepository.addAuthStateListener(authListener)
    }

    override fun onCleared() {
        authRepository.removeAuthStateListener(authListener)
        super.onCleared()
    }

    val profile: LiveData<UserProfile?> = repository.observeProfile()
    val firebaseUser: LiveData<FirebaseUser?> = _firebaseUser
    val isCloudAuthAvailable: Boolean
        get() = authRepository.isAvailable

    fun updateComfortRouting(enabled: Boolean) {
        viewModelScope.launch {
            repository.updateComfortRouting(enabled)
        }
    }

    fun signOut() {
        authRepository.signOut()
    }
}
