package com.navigatemama.app.wellness

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.navigatemama.app.R
import com.navigatemama.app.databinding.ActivityWellnessBinding
import com.navigatemama.app.shared.DynamicFeatureCoordinator

class WellnessActivity : AppCompatActivity() {
    private lateinit var binding: ActivityWellnessBinding
    private val viewModel: WellnessViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWellnessBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.backButton.setOnClickListener { finish() }
        binding.openHealthTools.setOnClickListener {
            DynamicFeatureCoordinator(this).openHealth(this)
        }

        viewModel.contractions.observe(this) { list ->
            val latest = list.firstOrNull()
            binding.contractionSummary.text = if (latest != null) {
                getString(
                    R.string.wellness_contraction_line,
                    latest.durationSeconds ?: 0,
                    latest.intervalSeconds ?: 0
                )
            } else {
                getString(R.string.wellness_none_contractions)
            }
        }
        viewModel.kickCounts.observe(this) { list ->
            val latest = list.firstOrNull()
            binding.kickSummary.text = if (latest != null) {
                getString(R.string.wellness_kick_line, latest.count, latest.durationMinutes)
            } else {
                getString(R.string.wellness_none_kicks)
            }
        }
        viewModel.sleepSessions.observe(this) { list ->
            val latest = list.firstOrNull()
            binding.sleepSummary.text = if (latest != null) {
                val hours = ((latest.endTime - latest.startTime) / 3_600_000).coerceAtLeast(1)
                getString(R.string.wellness_sleep_line, hours, latest.quality)
            } else {
                getString(R.string.wellness_none_sleep)
            }
        }
    }
}
