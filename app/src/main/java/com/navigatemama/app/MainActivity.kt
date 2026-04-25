package com.navigatemama.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts.StartIntentSenderForResult
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.navigatemama.app.databinding.ActivityMainBinding
import com.navigatemama.app.diagnostics.AppLog
import com.navigatemama.app.onboarding.OnboardingActivity
import com.navigatemama.app.onboarding.OnboardingPreferences
import com.navigatemama.app.shared.InAppUpdateCoordinator
import com.navigatemama.app.shared.ServiceLocator
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var updateCoordinator: InAppUpdateCoordinator

    private val appUpdateLauncher = registerForActivityResult(StartIntentSenderForResult()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (!OnboardingPreferences.isComplete(this)) {
            startActivity(Intent(this, OnboardingActivity::class.java))
            finish()
            return
        }
        enableEdgeToEdge()
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val navHost = supportFragmentManager.findFragmentById(R.id.nav_host) as NavHostFragment
        binding.bottomNav.setupWithNavController(navHost.navController)

        updateCoordinator = InAppUpdateCoordinator(this)
        updateCoordinator.maybeStartFlexibleUpdate(this, appUpdateLauncher)

        lifecycleScope.launch {
            runCatching {
                ServiceLocator.profileRepository(this@MainActivity).ensureDefaultProfile()
                val placesRepository = ServiceLocator.placesRepository(this@MainActivity)
                placesRepository.seedIfEmpty()
                ServiceLocator.childRepository(this@MainActivity).seedIfEmpty()
                placesRepository.syncPlacesFromFirestore()
            }.onFailure { error ->
                AppLog.w("Startup data sync failed; continuing in local mode.", error)
            }
        }
    }
}
