package com.navigatemama.app.wellness

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.ContractionLog
import com.navigatemama.core.model.KickCountLog
import com.navigatemama.core.model.SleepSession

/** Reads contraction, kick-count, and sleep logs from Room (same store as the Health dynamic feature). */
class WellnessViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ServiceLocator.wellnessRepository(application)

    val contractions: LiveData<List<ContractionLog>> = repository.observeContractions()
    val kickCounts: LiveData<List<KickCountLog>> = repository.observeKickCounts()
    val sleepSessions: LiveData<List<SleepSession>> = repository.observeSleepSessions()
}
