package com.navigatemama.app.journey

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.navigatemama.app.R
import com.navigatemama.app.databinding.FragmentJourneyBinding

class JourneyFragment : Fragment(R.layout.fragment_journey) {
    private val viewModel: JourneyViewModel by viewModels()
    private var binding: FragmentJourneyBinding? = null
    private lateinit var adapter: JourneyAdapter

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val fragmentBinding = FragmentJourneyBinding.bind(view)
        binding = fragmentBinding
        adapter = JourneyAdapter { week, mood -> viewModel.setMood(week, mood) }
        fragmentBinding.journeyList.adapter = adapter
        viewModel.journey.observe(viewLifecycleOwner) { adapter.submitList(it) }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }
}
