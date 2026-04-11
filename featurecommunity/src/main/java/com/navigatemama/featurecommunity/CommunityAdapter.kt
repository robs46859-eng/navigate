package com.navigatemama.featurecommunity

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.navigatemama.core.model.CommunityPost
import com.navigatemama.featurecommunity.databinding.ItemCommunityPostBinding

class CommunityAdapter : RecyclerView.Adapter<CommunityAdapter.CommunityViewHolder>() {
    private val items = mutableListOf<CommunityPost>()

    fun submit(posts: List<CommunityPost>) {
        items.clear()
        items.addAll(posts)
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CommunityViewHolder {
        val binding = ItemCommunityPostBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return CommunityViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CommunityViewHolder, position: Int) = holder.bind(items[position])

    override fun getItemCount(): Int = items.size

    class CommunityViewHolder(private val binding: ItemCommunityPostBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(post: CommunityPost) {
            binding.authorName.text = post.author
            binding.postTitle.text = post.title
            binding.postBody.text = post.content
            binding.postMeta.text = "${post.category} • ${post.postedAt} • ${post.likes} likes • ${post.replies} replies"
        }
    }
}
