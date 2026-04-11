package com.navigatemama.app.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.navigatemama.app.R
import com.navigatemama.app.databinding.ItemPlaceBinding
import com.navigatemama.core.model.Place
import java.text.NumberFormat

class PlaceAdapter(
    private val onClick: (Place) -> Unit,
    private val onFavoriteClick: (Place) -> Unit
) : RecyclerView.Adapter<PlaceAdapter.PlaceViewHolder>() {
    private val items = mutableListOf<Place>()
    private var favoriteIds: Set<String> = emptySet()

    fun submitList(places: List<Place>, favorites: Set<String>) {
        items.clear()
        items.addAll(places)
        favoriteIds = favorites
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PlaceViewHolder {
        val binding = ItemPlaceBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return PlaceViewHolder(binding)
    }

    override fun onBindViewHolder(holder: PlaceViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class PlaceViewHolder(
        private val binding: ItemPlaceBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(place: Place) {
            val ctx = binding.root.context
            val isFavorite = place.id in favoriteIds
            binding.placeName.text = place.name
            binding.placeAddress.text = place.address
            binding.placeMeta.text = ctx.getString(
                R.string.place_meta_format,
                place.category.name.replace('_', ' ').lowercase().replaceFirstChar { it.uppercase() },
                NumberFormat.getNumberInstance().format(place.reviewCount)
            )
            binding.placeStats.text = ctx.getString(
                R.string.place_stats_format,
                place.rating,
                place.avgCleanliness,
                (place.strollerAccessRate * 100).toInt()
            )
            binding.favoriteButton.setImageResource(
                if (isFavorite) R.drawable.ic_favorite_24 else R.drawable.ic_favorite_border_24
            )
            binding.favoriteButton.contentDescription = ctx.getString(
                if (isFavorite) R.string.favorite_remove else R.string.favorite
            )
            binding.placeContent.setOnClickListener { onClick(place) }
            binding.favoriteButton.setOnClickListener { onFavoriteClick(place) }
        }
    }
}
