package com.navigatemama.core.model

enum class UserStage {
    PREGNANT,
    NEWBORN_0_3,
    INFANT_3_6,
    BABY_6_12,
    TODDLER_1_3
}

enum class PlaceCategory {
    HOSPITAL,
    NURSING_ROOM,
    CHANGING_STATION,
    RESTROOM,
    REST_STOP,
    PLAYGROUND,
    URGENT_CARE,
    CAFE
}

data class UserProfile(
    val uid: String,
    val displayName: String,
    val email: String,
    val stage: UserStage,
    val dueDate: String?,
    val comfortRoutingEnabled: Boolean,
    val streakDays: Int = 0
)

data class Place(
    val id: String,
    val name: String,
    val address: String,
    val category: PlaceCategory,
    val latitude: Double,
    val longitude: Double,
    val source: String,
    val rating: Double,
    val reviewCount: Int,
    val description: String,
    val hours: String,
    val phone: String?,
    val websiteUrl: String?,
    val avgCleanliness: Double,
    val avgPrivacy: Double,
    val strollerAccessRate: Double
)

data class Review(
    val id: String,
    val placeId: String,
    val authorUid: String,
    val authorName: String,
    val rating: Int,
    val cleanliness: Int,
    val privacy: Int,
    val strollerAccess: Boolean,
    val notes: String,
    val createdAt: Long
)

data class JourneyEntry(
    val week: Int,
    val babySize: String,
    val fact: String,
    val tip: String,
    val mood: Int?
)

data class ContractionLog(
    val id: String,
    val startTime: Long,
    val endTime: Long?,
    val durationSeconds: Int?,
    val intervalSeconds: Int?,
    val intensity: Int
)

data class KickCountLog(
    val id: String,
    val startTime: Long,
    val endTime: Long,
    val count: Int,
    val durationMinutes: Int
)

data class SleepSession(
    val id: String,
    val startTime: Long,
    val endTime: Long,
    val quality: Int,
    val notes: String?
)

data class CommunityPost(
    val id: String,
    val author: String,
    val title: String,
    val content: String,
    val category: String,
    val postedAt: String,
    val replies: Int,
    val likes: Int
)
