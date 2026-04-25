package com.navigatemama.app.kids

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.navigatemama.app.databinding.ItemCareEventBinding
import com.navigatemama.core.model.CareEvent
import java.text.DateFormat
import java.util.Date

class CareEventAdapter : RecyclerView.Adapter<CareEventAdapter.CareEventViewHolder>() {
    private val items = mutableListOf<CareEvent>()
    private val timeFormat = DateFormat.getDateTimeInstance(DateFormat.SHORT, DateFormat.SHORT)

    fun submitList(events: List<CareEvent>) {
        items.clear()
        items.addAll(events)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CareEventViewHolder {
        val binding = ItemCareEventBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CareEventViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CareEventViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    inner class CareEventViewHolder(
        private val binding: ItemCareEventBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(event: CareEvent) {
            binding.eventTitle.text = event.title
            binding.eventType.text = event.type.name.replace('_', ' ').lowercase().replaceFirstChar { it.uppercase() }
            binding.eventTime.text = timeFormat.format(Date(event.occurredAt))
            binding.eventNotes.text = event.notes.orEmpty()
            binding.eventNotes.visibility = if (event.notes.isNullOrBlank()) View.GONE else View.VISIBLE
        }
    }
}
