package com.navigatemama.app.home

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.navigatemama.app.R
import com.navigatemama.app.databinding.ActivityPlaceDetailBinding

class PlaceDetailActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPlaceDetailBinding
    private val viewModel: PlaceDetailViewModel by viewModels()
    private val reviewAdapter = ReviewAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPlaceDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.reviewsList.adapter = reviewAdapter
        binding.backButton.setOnClickListener { finish() }

        val placeId = intent.getStringExtra("place_id").orEmpty()
        viewModel.setPlace(placeId)

        viewModel.place.observe(this) { place ->
            if (place == null) return@observe
            binding.placeTitle.text = place.name
            binding.placeAddress.text = place.address
            binding.placeDescription.text = place.description
            binding.routeButton.setOnClickListener {
                startActivity(
                    Intent(
                        Intent.ACTION_VIEW,
                        Uri.parse("google.navigation:q=${place.latitude},${place.longitude}")
                    )
                )
            }
            binding.addReviewButton.setOnClickListener {
                viewModel.addReview(binding.reviewInput.text.toString().trim())
                binding.reviewInput.setText("")
            }
        }
        viewModel.reviews.observe(this) { reviews -> reviewAdapter.submitList(reviews) }
        viewModel.isFavorite.observe(this) { favorite ->
            binding.favoriteButton.setImageResource(
                if (favorite == true) R.drawable.ic_favorite_24 else R.drawable.ic_favorite_border_24
            )
            binding.favoriteButton.contentDescription = getString(
                if (favorite == true) R.string.favorite_remove else R.string.favorite
            )
        }
        binding.favoriteButton.setOnClickListener { viewModel.toggleFavorite() }
    }
}
