package com.navigatemama.app.auth

import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import com.navigatemama.app.databinding.ActivityAuthBinding
import com.navigatemama.app.shared.ServiceLocator
import kotlinx.coroutines.launch

class AuthActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAuthBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAuthBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val authRepo = ServiceLocator.authRepository(this)
        binding.toolbar.setNavigationOnClickListener { finish() }
        if (!authRepo.isAvailable) {
            binding.emailInput.isEnabled = false
            binding.passwordInput.isEnabled = false
            binding.signInButton.isEnabled = false
            binding.registerButton.isEnabled = false
            binding.errorText.text = getString(com.navigatemama.app.R.string.auth_unavailable)
            binding.errorText.visibility = View.VISIBLE
            return
        }

        binding.signInButton.setOnClickListener { submit(authRepo, isRegister = false) }
        binding.registerButton.setOnClickListener { submit(authRepo, isRegister = true) }
    }

    private fun submit(authRepo: com.navigatemama.core.data.repository.AuthRepository, isRegister: Boolean) {
        val email = binding.emailInput.text.toString().trim()
        val password = binding.passwordInput.text.toString()
        if (email.isEmpty() || password.length < 6) {
            Snackbar.make(binding.root, com.navigatemama.app.R.string.auth_invalid_input, Snackbar.LENGTH_SHORT).show()
            return
        }
        binding.progress.visibility = View.VISIBLE
        binding.errorText.visibility = View.GONE
        lifecycleScope.launch {
            try {
                if (isRegister) {
                    authRepo.registerWithEmail(email, password)
                } else {
                    authRepo.signInWithEmail(email, password)
                }
                finish()
            } catch (e: Exception) {
                binding.errorText.text = e.message ?: getString(com.navigatemama.app.R.string.auth_failed)
                binding.errorText.visibility = View.VISIBLE
            } finally {
                binding.progress.visibility = View.GONE
            }
        }
    }
}
