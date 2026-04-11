package com.navigatemama.app.onboarding

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.widget.ArrayAdapter
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.widget.doAfterTextChanged
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.navigatemama.app.MainActivity
import com.navigatemama.app.R
import com.navigatemama.app.databinding.ActivityOnboardingBinding
import com.navigatemama.app.shared.ServiceLocator
import com.navigatemama.core.model.UserStage
import kotlinx.coroutines.launch

class OnboardingActivity : AppCompatActivity() {
    private lateinit var binding: ActivityOnboardingBinding

    private val locationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        binding.locationStatus.visibility = View.VISIBLE
        binding.locationStatus.text = getString(
            if (granted) R.string.onboarding_location_allowed else R.string.onboarding_location_denied
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityOnboardingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val stages = UserStage.entries.toList()
        val labels = stages.map { formatStageLabel(it) }
        binding.stageInput.setAdapter(
            ArrayAdapter(this, android.R.layout.simple_list_item_1, labels)
        )
        binding.stageInput.setText(labels[0], false)

        binding.nameInput.doAfterTextChanged {
            binding.continueButton.isEnabled = binding.nameInput.text.toString().trim().isNotEmpty()
        }
        binding.continueButton.isEnabled = binding.nameInput.text.toString().trim().isNotEmpty()

        binding.allowLocationButton.setOnClickListener {
            val permission = Manifest.permission.ACCESS_FINE_LOCATION
            if (ContextCompat.checkSelfPermission(this, permission) == PackageManager.PERMISSION_GRANTED) {
                binding.locationStatus.visibility = View.VISIBLE
                binding.locationStatus.text = getString(R.string.onboarding_location_allowed)
            } else {
                binding.locationStatus.visibility = View.VISIBLE
                binding.locationStatus.text = getString(R.string.onboarding_location_prompt)
                locationPermissionLauncher.launch(permission)
            }
        }

        binding.skipButton.setOnClickListener {
            lifecycleScope.launch {
                ServiceLocator.profileRepository(this@OnboardingActivity).ensureDefaultProfile()
                OnboardingPreferences.setComplete(this@OnboardingActivity)
                goMain()
            }
        }

        binding.continueButton.setOnClickListener {
            val name = binding.nameInput.text.toString().trim()
            if (name.isEmpty()) {
                Snackbar.make(binding.root, R.string.onboarding_name_required, Snackbar.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            val email = binding.emailInput.text.toString().trim().ifEmpty { "" }
            val dueRaw = binding.dueDateInput.text.toString().trim()
            val dueDate = dueRaw.ifEmpty { null }
            val stageLabel = binding.stageInput.text.toString().trim()
            val idx = labels.indexOf(stageLabel)
            val stage = if (idx >= 0) stages[idx] else UserStage.PREGNANT

            lifecycleScope.launch {
                ServiceLocator.profileRepository(this@OnboardingActivity).saveOnboardingProfile(
                    displayName = name,
                    email = email,
                    stage = stage,
                    dueDate = dueDate
                )
                OnboardingPreferences.setComplete(this@OnboardingActivity)
                goMain()
            }
        }
    }

    private fun goMain() {
        startActivity(Intent(this, MainActivity::class.java))
        finish()
    }

    private fun formatStageLabel(stage: UserStage): String = when (stage) {
        UserStage.PREGNANT -> getString(R.string.stage_pregnant)
        UserStage.NEWBORN_0_3 -> getString(R.string.stage_newborn)
        UserStage.INFANT_3_6 -> getString(R.string.stage_infant)
        UserStage.BABY_6_12 -> getString(R.string.stage_baby)
        UserStage.TODDLER_1_3 -> getString(R.string.stage_toddler)
    }
}
