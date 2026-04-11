package com.navigatemama.app.journey

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.navigatemama.app.databinding.ItemJourneyBinding
import com.navigatemama.core.model.JourneyEntry

class JourneyAdapter(
    private val onMoodSelected: (Int, Int) -> Unit
) : RecyclerView.Adapter<JourneyAdapter.JourneyViewHolder>() {
    private val items = mutableListOf<JourneyEntry>()

    fun submitList(entries: List<JourneyEntry>) {
        items.clear()
        items.addAll(entries)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JourneyViewHolder {
        val binding = ItemJourneyBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return JourneyViewHolder(binding)
    }

    override fun onBindViewHolder(holder: JourneyViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class JourneyViewHolder(
        private val binding: ItemJourneyBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(entry: JourneyEntry) {
            binding.weekLabel.text = "Week ${entry.week}"
            binding.sizeLabel.text = entry.babySize
            binding.factLabel.text = entry.fact
            binding.tipLabel.text = entry.tip
            binding.moodBar.rating = ((entry.mood ?: 2) + 1).toFloat()
            binding.moodBar.setOnRatingBarChangeListener { _, rating, _ ->
                onMoodSelected(entry.week, rating.toInt() - 1)
            }
        }
    }
}
