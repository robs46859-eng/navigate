package com.navigatemama.app.home

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.switchMap
import androidx.lifecycle.viewModelScope
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.Place
import com.navigatemama.core.model.Review
import kotlinx.coroutines.launch

class PlaceDetailViewModel(application: Application) : AndroidViewModel(application) {
    private val placesRepository = ServiceLocator.placesRepository(application)
    private val profileRepository = ServiceLocator.profileRepository(application)
    private val placeId = MutableLiveData<String>()

    val place: LiveData<Place?> = placeId.switchMap { id -> placesRepository.observePlace(id) }
    val reviews: LiveData<List<Review>> = placeId.switchMap { id -> placesRepository.observeReviews(id) }
    val isFavorite: LiveData<Boolean> = placeId.switchMap { id ->
        if (id.isEmpty()) MutableLiveData(false) else placesRepository.observeFavorite(id)
    }

    fun setPlace(placeId: String) {
        this.placeId.value = placeId
    }

    fun toggleFavorite() {
        val id = placeId.value ?: return
        viewModelScope.launch {
            placesRepository.toggleFavorite(id)
        }
    }

    fun addReview(notes: String) {
        val target = placeId.value ?: return
        if (notes.isEmpty()) return
        viewModelScope.launch {
            val profile = profileRepository.getProfileOnce()
            val authorUid = profile?.uid ?: "local-user"
            val authorName = profile?.displayName ?: "You"
            placesRepository.addReview(
                placeId = target,
                authorUid = authorUid,
                authorName = authorName,
                rating = 5,
                cleanliness = 5,
                privacy = 4,
                strollerAccess = true,
                notes = notes
            )
        }
    }
}
