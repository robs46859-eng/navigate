package com.navigatemama.app.kids

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.navigatemama.app.R
import com.navigatemama.app.databinding.FragmentKidsBinding
import com.navigatemama.core.model.CareEventType
import com.navigatemama.core.model.ChildProfile

class KidsFragment : Fragment(R.layout.fragment_kids) {
    private val viewModel: KidsViewModel by viewModels()
    private var binding: FragmentKidsBinding? = null
    private lateinit var adapter: CareEventAdapter
    private var selectedChild: ChildProfile? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val fragmentBinding = FragmentKidsBinding.bind(view)
        binding = fragmentBinding

        adapter = CareEventAdapter()
        fragmentBinding.careEventsList.adapter = adapter

        val quickLogButtons = listOf(
            fragmentBinding.feedButton to CareEventType.FEEDING,
            fragmentBinding.diaperButton to CareEventType.DIAPER,
            fragmentBinding.sleepButton to CareEventType.SLEEP,
            fragmentBinding.medicineButton to CareEventType.MEDICINE,
            fragmentBinding.appointmentButton to CareEventType.APPOINTMENT,
            fragmentBinding.milestoneButton to CareEventType.MILESTONE
        )
        quickLogButtons.forEach { (button, type) ->
            button.setOnClickListener { addEvent(type) }
        }

        viewModel.children.observe(viewLifecycleOwner) { children ->
            selectedChild = children.firstOrNull()
            renderChild(selectedChild)
            quickLogButtons.forEach { (button, _) -> button.isEnabled = selectedChild != null }
        }
        viewModel.careEvents.observe(viewLifecycleOwner) { events ->
            adapter.submitList(events.take(12))
            fragmentBinding.emptyCareLog.visibility = if (events.isEmpty()) View.VISIBLE else View.GONE
        }
    }

    private fun renderChild(child: ChildProfile?) {
        val fragmentBinding = binding ?: return
        if (child == null) {
            fragmentBinding.childName.text = getString(R.string.kids_no_child_title)
            fragmentBinding.childDetails.text = getString(R.string.kids_no_child_body)
            fragmentBinding.childCareTeam.text = ""
            return
        }
        fragmentBinding.childName.text = child.name
        fragmentBinding.childDetails.text = getString(R.string.kids_child_details_format, child.stageLabel, child.birthDate)
        fragmentBinding.childCareTeam.text = getString(
            R.string.kids_care_team_format,
            child.pediatrician ?: getString(R.string.kids_not_set),
            child.allergies ?: getString(R.string.kids_not_set)
        )
    }

    private fun addEvent(type: CareEventType) {
        selectedChild?.let { child ->
            viewModel.addQuickEvent(child.id, type)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }
}
