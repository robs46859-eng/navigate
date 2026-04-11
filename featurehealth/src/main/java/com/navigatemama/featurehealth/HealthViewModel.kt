package com.navigatemama.featurehealth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.ContractionLog
import com.navigatemama.core.model.KickCountLog
import com.navigatemama.core.model.SleepSession
import kotlinx.coroutines.launch
import java.util.UUID

class HealthViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ServiceLocator.wellnessRepository(application)
    val contractions: LiveData<List<ContractionLog>> = repository.observeContractions()
    val kickCounts: LiveData<List<KickCountLog>> = repository.observeKickCounts()
    val sleepSessions: LiveData<List<SleepSession>> = repository.observeSleepSessions()

    fun logContraction() {
        val now = System.currentTimeMillis()
        viewModelScope.launch {
            repository.saveContraction(
                ContractionLog(
                    id = UUID.randomUUID().toString(),
                    startTime = now - 55_000,
                    endTime = now,
                    durationSeconds = 55,
                    intervalSeconds = 300,
                    intensity = 4
                )
            )
        }
    }

    fun logKickCount() {
        val now = System.currentTimeMillis()
        viewModelScope.launch {
            repository.saveKickCount(
                KickCountLog(
                    id = UUID.randomUUID().toString(),
                    startTime = now - 1_200_000,
                    endTime = now,
                    count = 12,
                    durationMinutes = 20
                )
            )
        }
    }

    fun logSleepSession() {
        val now = System.currentTimeMillis()
        viewModelScope.launch {
            repository.saveSleepSession(
                SleepSession(
                    id = UUID.randomUUID().toString(),
                    startTime = now - 5_400_000,
                    endTime = now,
                    quality = 4,
                    notes = "Two wake-ups, settled with white noise and feeding."
                )
            )
        }
    }
}
