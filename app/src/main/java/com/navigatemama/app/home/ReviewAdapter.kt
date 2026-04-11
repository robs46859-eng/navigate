package com.navigatemama.app.home

import android.text.format.DateUtils
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.navigatemama.app.databinding.ItemReviewBinding
import com.navigatemama.core.model.Review

class ReviewAdapter : RecyclerView.Adapter<ReviewAdapter.ReviewViewHolder>() {
    private val items = mutableListOf<Review>()

    fun submitList(reviews: List<Review>) {
        items.clear()
        items.addAll(reviews)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ReviewViewHolder {
        val binding = ItemReviewBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ReviewViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ReviewViewHolder, position: Int) {
        holder.bind(items[position])
    }

    override fun getItemCount(): Int = items.size

    class ReviewViewHolder(
        private val binding: ItemReviewBinding
    ) : RecyclerView.ViewHolder(binding.root) {
        fun bind(review: Review) {
            binding.authorName.text = review.authorName
            binding.reviewBody.text = review.notes
            binding.reviewMeta.text = DateUtils.getRelativeTimeSpanString(review.createdAt)
        }
    }
}
