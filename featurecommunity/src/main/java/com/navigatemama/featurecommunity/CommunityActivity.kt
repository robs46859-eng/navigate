package com.navigatemama.featurecommunity

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.navigatemama.core.data.repository.CommunitySeed
import com.navigatemama.featurecommunity.databinding.ActivityCommunityBinding

class CommunityActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCommunityBinding
    private val adapter = CommunityAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCommunityBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.backButton.setOnClickListener { finish() }
        binding.communityList.adapter = adapter
        adapter.submit(CommunitySeed.posts())
    }
}
