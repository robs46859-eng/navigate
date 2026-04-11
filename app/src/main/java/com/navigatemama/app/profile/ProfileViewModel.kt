package com.navigatemama.app.profile

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.UserProfile
import kotlinx.coroutines.launch

class ProfileViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ServiceLocator.profileRepository(application)
    private val auth = FirebaseAuth.getInstance()

    private val _firebaseUser = MutableLiveData<FirebaseUser?>(auth.currentUser)
    private val authListener = FirebaseAuth.AuthStateListener { a ->
        _firebaseUser.postValue(a.currentUser)
    }

    init {
        auth.addAuthStateListener(authListener)
    }

    override fun onCleared() {
        auth.removeAuthStateListener(authListener)
        super.onCleared()
    }

    val profile: LiveData<UserProfile?> = repository.observeProfile()
    val firebaseUser: LiveData<FirebaseUser?> = _firebaseUser

    fun updateComfortRouting(enabled: Boolean) {
        viewModelScope.launch {
            repository.updateComfortRouting(enabled)
        }
    }

    fun signOut() {
        ServiceLocator.authRepository(getApplication()).signOut()
    }
}
