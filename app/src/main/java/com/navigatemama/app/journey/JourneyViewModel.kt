package com.navigatemama.app.journey

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.JourneyEntry
import kotlinx.coroutines.launch

class JourneyViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ServiceLocator.journeyRepository(application)
    val journey: LiveData<List<JourneyEntry>> = repository.observeJourney()

    fun setMood(week: Int, mood: Int) {
        viewModelScope.launch {
            repository.updateMood(week, mood)
        }
    }
}
