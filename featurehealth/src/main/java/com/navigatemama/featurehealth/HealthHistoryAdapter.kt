package com.navigatemama.featurehealth

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.navigatemama.featurehealth.databinding.ItemHealthMetricBinding

class HealthHistoryAdapter : RecyclerView.Adapter<HealthHistoryAdapter.MetricViewHolder>() {
    private val items = mutableListOf<Pair<String, String>>()

    fun submit(items: List<Pair<String, String>>) {
        this.items.clear()
        this.items.addAll(items)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MetricViewHolder {
        val binding = ItemHealthMetricBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MetricViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MetricViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    class MetricViewHolder(private val binding: ItemHealthMetricBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(item: Pair<String, String>) {
            binding.metricTitle.text = item.first
            binding.metricValue.text = item.second
        }
    }
}
