package com.navigatemama.app.home

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MediatorLiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.Place
import kotlinx.coroutines.launch

class HomeViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ServiceLocator.placesRepository(application)

    val places: LiveData<List<Place>> = repository.observePlaces()
    val favoriteIds: LiveData<Set<String>> = repository.observeFavoritePlaceIds()

    private val _showSavedOnly = MutableLiveData(false)
    val showSavedOnly: LiveData<Boolean> = _showSavedOnly

    val displayedPlaces = MediatorLiveData<List<Place>>()

    init {
        val recompute = {
            val all = places.value ?: emptyList()
            val fav = favoriteIds.value ?: emptySet()
            displayedPlaces.value = if (_showSavedOnly.value == true) {
                all.filter { it.id in fav }
            } else {
                all
            }
        }
        displayedPlaces.addSource(places) { recompute() }
        displayedPlaces.addSource(favoriteIds) { recompute() }
        displayedPlaces.addSource(_showSavedOnly) { recompute() }
    }

    fun setShowSavedOnly(show: Boolean) {
        if (_showSavedOnly.value != show) {
            _showSavedOnly.value = show
        }
    }

    fun toggleFavorite(placeId: String) {
        viewModelScope.launch {
            repository.toggleFavorite(placeId)
        }
    }

    fun refresh() {
        viewModelScope.launch {
            repository.syncPlacesFromFirestore()
        }
    }
}
