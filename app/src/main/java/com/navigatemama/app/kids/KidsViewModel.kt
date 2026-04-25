package com.navigatemama.app.kids

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.viewModelScope
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.CareEvent
import com.navigatemama.core.model.CareEventType
import com.navigatemama.core.model.ChildProfile
import kotlinx.coroutines.launch

class KidsViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = ServiceLocator.childRepository(application)

    val children: LiveData<List<ChildProfile>> = repository.observeChildren()
    val careEvents: LiveData<List<CareEvent>> = repository.observeCareEvents()

    fun addQuickEvent(childId: String, type: CareEventType) {
        viewModelScope.launch {
            repository.addCareEvent(
                childId = childId,
                type = type,
                title = type.displayTitle(),
                notes = type.defaultNote()
            )
        }
    }

    private fun CareEventType.displayTitle(): String = when (this) {
        CareEventType.FEEDING -> "Feeding"
        CareEventType.DIAPER -> "Diaper change"
        CareEventType.SLEEP -> "Sleep"
        CareEventType.MEDICINE -> "Medicine"
        CareEventType.APPOINTMENT -> "Appointment"
        CareEventType.MILESTONE -> "Milestone"
    }

    private fun CareEventType.defaultNote(): String = when (this) {
        CareEventType.FEEDING -> "Quick logged feed"
        CareEventType.DIAPER -> "Quick logged diaper"
        CareEventType.SLEEP -> "Quick logged rest"
        CareEventType.MEDICINE -> "Review dosage details with your care team"
        CareEventType.APPOINTMENT -> "Upcoming or completed care visit"
        CareEventType.MILESTONE -> "New moment to remember"
    }
}
