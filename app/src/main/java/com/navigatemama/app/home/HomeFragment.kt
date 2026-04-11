package com.navigatemama.app.home

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.navigatemama.app.R
import com.navigatemama.app.databinding.FragmentHomeBinding
import com.navigatemama.app.location.LocationEducationPrefs
import com.navigatemama.app.shared.DynamicFeatureCoordinator
import com.navigatemama.core.model.Place

class HomeFragment : Fragment(R.layout.fragment_home), OnMapReadyCallback {
    private var binding: FragmentHomeBinding? = null
    private val viewModel: HomeViewModel by viewModels()
    private lateinit var adapter: PlaceAdapter
    private var googleMap: GoogleMap? = null
    private val denver = LatLng(39.7392, -104.9903)

    private val locationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) enableLocation()
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val fragmentBinding = FragmentHomeBinding.bind(view)
        binding = fragmentBinding

        fragmentBinding.swipeRefresh.setColorSchemeColors(
            ContextCompat.getColor(requireContext(), R.color.primary_container),
            ContextCompat.getColor(requireContext(), R.color.primary_light)
        )

        adapter = PlaceAdapter(
            onClick = { place -> openPlace(place) },
            onFavoriteClick = { place -> viewModel.toggleFavorite(place.id) }
        )
        fragmentBinding.placesList.adapter = adapter
        fragmentBinding.swipeRefresh.setOnRefreshListener {
            viewModel.refresh()
        }

        fragmentBinding.savedOnlyChip.setOnCheckedChangeListener { _, checked ->
            viewModel.setShowSavedOnly(checked)
        }
        viewModel.showSavedOnly.observe(viewLifecycleOwner) { checked ->
            if (fragmentBinding.savedOnlyChip.isChecked != checked) {
                fragmentBinding.savedOnlyChip.isChecked = checked
            }
        }

        fragmentBinding.openHealth.setOnClickListener {
            DynamicFeatureCoordinator(requireContext()).openHealth(requireActivity())
        }
        fragmentBinding.openCommunity.setOnClickListener {
            DynamicFeatureCoordinator(requireContext()).openOrInstallCommunity(requireActivity())
        }

        val mapFragment = childFragmentManager.findFragmentById(R.id.map_fragment) as? SupportMapFragment
            ?: SupportMapFragment.newInstance().also {
                childFragmentManager.beginTransaction().replace(R.id.map_fragment, it).commitNow()
            }
        mapFragment.getMapAsync(this)

        var lastDisplayed: List<Place> = emptyList()
        var lastFavorites: Set<String> = emptySet()

        fun pushList() {
            adapter.submitList(lastDisplayed, lastFavorites)
        }

        viewModel.displayedPlaces.observe(viewLifecycleOwner) { places ->
            lastDisplayed = places ?: emptyList()
            fragmentBinding.swipeRefresh.isRefreshing = false
            pushList()
            updateMapMarkers(lastDisplayed)
        }
        viewModel.favoriteIds.observe(viewLifecycleOwner) { favs ->
            lastFavorites = favs ?: emptySet()
            pushList()
        }
    }

    override fun onMapReady(map: GoogleMap) {
        googleMap = map.apply {
            uiSettings.isCompassEnabled = true
            uiSettings.isMapToolbarEnabled = false
            moveCamera(CameraUpdateFactory.newLatLngZoom(denver, 11f))
        }
        requestLocation()
    }

    private fun updateMapMarkers(places: List<Place>) {
        val map = googleMap ?: return
        map.clear()
        map.addMarker(MarkerOptions().position(denver).title("Denver home base"))
        places.forEach { place ->
            map.addMarker(
                MarkerOptions()
                    .position(LatLng(place.latitude, place.longitude))
                    .title(place.name)
                    .snippet(place.address)
            )
        }
    }

    private fun requestLocation() {
        val permission = Manifest.permission.ACCESS_FINE_LOCATION
        if (ContextCompat.checkSelfPermission(requireContext(), permission) == PackageManager.PERMISSION_GRANTED) {
            enableLocation()
            return
        }

        when {
            !LocationEducationPrefs.hasSeen(requireContext()) -> {
                MaterialAlertDialogBuilder(requireContext())
                    .setTitle(R.string.location_edu_title)
                    .setMessage(R.string.location_edu_body)
                    .setPositiveButton(R.string.onboarding_continue) { _, _ ->
                        LocationEducationPrefs.markSeen(requireContext())
                        launchPermissionFlow(permission)
                    }
                    .setNegativeButton(android.R.string.cancel, null)
                    .show()
            }
            else -> launchPermissionFlow(permission)
        }
    }

    private fun launchPermissionFlow(permission: String) {
        if (shouldShowRequestPermissionRationale(permission)) {
            MaterialAlertDialogBuilder(requireContext())
                .setTitle(R.string.location_rationale_title)
                .setMessage(R.string.location_rationale_body)
                .setPositiveButton(R.string.onboarding_continue) { _, _ ->
                    locationPermissionLauncher.launch(permission)
                }
                .show()
        } else {
            locationPermissionLauncher.launch(permission)
        }
    }

    private fun enableLocation() {
        val map = googleMap ?: return
        if (ContextCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            map.isMyLocationEnabled = true
            LocationServices.getFusedLocationProviderClient(requireContext()).lastLocation
                .addOnSuccessListener { location ->
                    if (location != null) {
                        map.animateCamera(
                            CameraUpdateFactory.newLatLngZoom(LatLng(location.latitude, location.longitude), 12f)
                        )
                    }
                }
        }
    }

    private fun openPlace(place: Place) {
        startActivity(Intent(requireContext(), PlaceDetailActivity::class.java).putExtra("place_id", place.id))
    }

    override fun onDestroyView() {
        super.onDestroyView()
        binding = null
    }
}
