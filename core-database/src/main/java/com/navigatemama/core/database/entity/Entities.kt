package com.navigatemama.core.database.entity

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import com.navigatemama.core.model.PlaceCategory
import com.navigatemama.core.model.UserStage

@Entity(tableName = "user_profile")
data class UserProfileEntity(
    @PrimaryKey val uid: String,
    val displayName: String,
    val email: String,
    val stage: UserStage,
    val dueDate: String?,
    val comfortRoutingEnabled: Boolean,
    val streakDays: Int
)

@Entity(
    tableName = "favorites",
    foreignKeys = [
        ForeignKey(
            entity = PlaceEntity::class,
            parentColumns = ["id"],
            childColumns = ["placeId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("placeId")]
)
data class FavoriteEntity(
    @PrimaryKey val placeId: String,
    val savedAtMillis: Long
)

@Entity(tableName = "places")
data class PlaceEntity(
    @PrimaryKey val id: String,
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

@Entity(
    tableName = "reviews",
    foreignKeys = [
        ForeignKey(
            entity = PlaceEntity::class,
            parentColumns = ["id"],
            childColumns = ["placeId"],
            onDelete = ForeignKey.CASCADE
        )
    ],
    indices = [Index("placeId")]
)
data class ReviewEntity(
    @PrimaryKey val id: String,
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

@Entity(tableName = "journey_entries")
data class JourneyEntryEntity(
    @PrimaryKey val week: Int,
    val babySize: String,
    val fact: String,
    val tip: String,
    val mood: Int?
)

@Entity(tableName = "contractions")
data class ContractionEntity(
    @PrimaryKey val id: String,
    val startTime: Long,
    val endTime: Long?,
    val durationSeconds: Int?,
    val intervalSeconds: Int?,
    val intensity: Int
)

@Entity(tableName = "kick_counts")
data class KickCountEntity(
    @PrimaryKey val id: String,
    val startTime: Long,
    val endTime: Long,
    val count: Int,
    val durationMinutes: Int
)

@Entity(tableName = "sleep_sessions")
data class SleepSessionEntity(
    @PrimaryKey val id: String,
    val startTime: Long,
    val endTime: Long,
    val quality: Int,
    val notes: String?
)
