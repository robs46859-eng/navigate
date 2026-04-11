package com.navigatemama.app.profile

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.navigatemama.app.R
import com.navigatemama.app.auth.AuthActivity
import com.navigatemama.app.databinding.FragmentProfileBinding
import com.navigatemama.app.shared.DynamicFeatureCoordinator
import com.navigatemama.app.shared.InAppReviewCoordinator
import com.navigatemama.app.wellness.WellnessActivity

class ProfileFragment : Fragment(R.layout.fragment_profile) {
    private val viewModel: ProfileViewModel by viewModels()
    private var binding: FragmentProfileBinding? = null

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val fragmentBinding = FragmentProfileBinding.bind(view)
        binding = fragmentBinding

        viewModel.firebaseUser.observe(viewLifecycleOwner) { user ->
            if (user != null) {
                fragmentBinding.authStatus.text = getString(R.string.auth_signed_in_as, user.email ?: "")
                fragmentBinding.signInButton.visibility = View.GONE
                fragmentBinding.signOutButton.visibility = View.VISIBLE
            } else {
                fragmentBinding.authStatus.text = getString(R.string.auth_signed_out_hint)
                fragmentBinding.signInButton.visibility = View.VISIBLE
                fragmentBinding.signOutButton.visibility = View.GONE
            }
        }

        fragmentBinding.signInButton.setOnClickListener {
            startActivity(Intent(requireContext(), AuthActivity::class.java))
        }
        fragmentBinding.signOutButton.setOnClickListener {
            viewModel.signOut()
        }

        fragmentBinding.wellnessButton.setOnClickListener {
            startActivity(Intent(requireContext(), WellnessActivity::class.java))
        }

        viewModel.profile.observe(viewLifecycleOwner) { profile ->
            if (profile == null) return@observe
            fragmentBinding.profileName.text = profile.displayName
            fragmentBinding.profileEmail.text = profile.email.ifEmpty { getString(R.string.profile_email_placeholder) }
            fragmentBinding.profileStage.text = profile.stage.name.replace('_', ' ').lowercase().replaceFirstChar { it.uppercase() }
            fragmentBinding.routingSwitch.isChecked = profile.comfortRoutingEnabled
            fragmentBinding.streakLabel.text = getString(R.string.streak_format, profile.streakDays)
        }

        fragmentBinding.routingSwitch.setOnCheckedChangeListener { _, checked ->
            viewModel.updateComfortRouting(checked)
        }
        fragmentBinding.reviewButton.setOnClickListener {
            InAppReviewCoordinator(requireContext()).launch(requireActivity())
        }
        fragmentBinding.healthButton.setOnClickListener {
            DynamicFeatureCoordinator(requireContext()).openHealth(requireActivity())
        }
        fragmentBinding.communityButton.setOnClickListener {
            DynamicFeatureCoordinator(requireContext()).openOrInstallCommunity(requireActivity())
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }
}
