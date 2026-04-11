package com.navigatemama.featurehealth

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.navigatemama.featurehealth.databinding.ActivityHealthBinding

class HealthActivity : AppCompatActivity() {
    private lateinit var binding: ActivityHealthBinding
    private val viewModel: HealthViewModel by viewModels()
    private val adapter = HealthHistoryAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHealthBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.metricsList.adapter = adapter
        binding.backButton.setOnClickListener { finish() }
        binding.logContraction.setOnClickListener { viewModel.logContraction() }
        binding.logKicks.setOnClickListener { viewModel.logKickCount() }
        binding.logSleep.setOnClickListener { viewModel.logSleepSession() }

        viewModel.contractions.observe(this) { contractions ->
            val latestContraction = contractions.firstOrNull()
            val rows = buildList {
                add("Latest contraction" to (latestContraction?.durationSeconds?.let { "$it sec, every ${latestContraction.intervalSeconds ?: 0} sec" } ?: "No contractions logged"))
                add("Kick count session" to (viewModel.kickCounts.value?.firstOrNull()?.let { "${it.count} kicks in ${it.durationMinutes} min" } ?: "No kick session logged"))
                add("Last sleep entry" to (viewModel.sleepSessions.value?.firstOrNull()?.let { "${(it.endTime - it.startTime) / 3_600_000} hr, quality ${it.quality}/5" } ?: "No sleep session logged"))
                add("5-1-1 guidance" to "Head to care when contractions are 5 minutes apart, 1 minute long, for 1 hour.")
            }
            adapter.submit(rows)
        }
        viewModel.kickCounts.observe(this) {
            viewModel.contractions.value?.let { current -> adapter.submit(adapterSnapshot(current)) }
        }
        viewModel.sleepSessions.observe(this) {
            viewModel.contractions.value?.let { current -> adapter.submit(adapterSnapshot(current)) }
        }
    }

    private fun adapterSnapshot(contractions: List<com.navigatemama.core.model.ContractionLog>): List<Pair<String, String>> {
        val latestContraction = contractions.firstOrNull()
        val latestKicks = viewModel.kickCounts.value?.firstOrNull()
        val latestSleep = viewModel.sleepSessions.value?.firstOrNull()
        return listOf(
            "Latest contraction" to (latestContraction?.durationSeconds?.let { "$it sec, every ${latestContraction.intervalSeconds ?: 0} sec" } ?: "No contractions logged"),
            "Kick count session" to (latestKicks?.let { "${it.count} kicks in ${it.durationMinutes} min" } ?: "No kick session logged"),
            "Last sleep entry" to (latestSleep?.let { "${(it.endTime - it.startTime) / 3_600_000} hr, quality ${it.quality}/5" } ?: "No sleep session logged"),
            "5-1-1 guidance" to "Head to care when contractions are 5 minutes apart, 1 minute long, for 1 hour."
        )
    }
}
