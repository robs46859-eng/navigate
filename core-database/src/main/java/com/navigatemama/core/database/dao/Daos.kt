package com.navigatemama.core.database.dao

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.navigatemama.core.database.entity.ContractionEntity
import com.navigatemama.core.database.entity.FavoriteEntity
import com.navigatemama.core.database.entity.JourneyEntryEntity
import com.navigatemama.core.database.entity.KickCountEntity
import com.navigatemama.core.database.entity.PlaceEntity
import com.navigatemama.core.database.entity.ReviewEntity
import com.navigatemama.core.database.entity.SleepSessionEntity
import com.navigatemama.core.database.entity.UserProfileEntity

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profile LIMIT 1")
    fun observeProfile(): LiveData<UserProfileEntity?>

    @Query("SELECT * FROM user_profile LIMIT 1")
    suspend fun getProfile(): UserProfileEntity?

    @Query("SELECT COUNT(*) FROM user_profile")
    suspend fun count(): Int

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(profile: UserProfileEntity)

    @Query("DELETE FROM user_profile")
    suspend fun clearAll()
}

@Dao
interface PlaceDao {
    @Query("SELECT * FROM places ORDER BY rating DESC, name ASC")
    fun observePlaces(): LiveData<List<PlaceEntity>>

    @Query("SELECT * FROM places WHERE category = :category ORDER BY rating DESC, name ASC")
    fun observePlacesByCategory(category: String): LiveData<List<PlaceEntity>>

    @Query("SELECT * FROM places WHERE id = :placeId LIMIT 1")
    fun observePlace(placeId: String): LiveData<PlaceEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun replaceAll(places: List<PlaceEntity>)

    @Query("SELECT COUNT(*) FROM places")
    suspend fun count(): Int
}

@Dao
interface FavoriteDao {
    @Query("SELECT placeId FROM favorites ORDER BY savedAtMillis DESC")
    fun observeFavoritePlaceIds(): LiveData<List<String>>

    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE placeId = :placeId)")
    fun observeIsFavorite(placeId: String): LiveData<Boolean>

    @Query("SELECT EXISTS(SELECT 1 FROM favorites WHERE placeId = :placeId)")
    suspend fun isFavorite(placeId: String): Boolean

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(entity: FavoriteEntity)

    @Query("DELETE FROM favorites WHERE placeId = :placeId")
    suspend fun deleteByPlaceId(placeId: String)
}

@Dao
interface ReviewDao {
    @Query("SELECT * FROM reviews WHERE placeId = :placeId ORDER BY createdAt DESC")
    fun observeReviews(placeId: String): LiveData<List<ReviewEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(review: ReviewEntity)
}

@Dao
interface JourneyDao {
    @Query("SELECT * FROM journey_entries ORDER BY week ASC")
    fun observeEntries(): LiveData<List<JourneyEntryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun replaceAll(entries: List<JourneyEntryEntity>)

    @Query("UPDATE journey_entries SET mood = :mood WHERE week = :week")
    suspend fun updateMood(week: Int, mood: Int?)

    @Query("SELECT COUNT(*) FROM journey_entries")
    suspend fun count(): Int
}

@Dao
interface WellnessDao {
    @Query("SELECT * FROM contractions ORDER BY startTime DESC")
    fun observeContractions(): LiveData<List<ContractionEntity>>

    @Query("SELECT * FROM kick_counts ORDER BY startTime DESC")
    fun observeKickCounts(): LiveData<List<KickCountEntity>>

    @Query("SELECT * FROM sleep_sessions ORDER BY startTime DESC")
    fun observeSleepSessions(): LiveData<List<SleepSessionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertContraction(contraction: ContractionEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertKickCount(kickCount: KickCountEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertSleepSession(session: SleepSessionEntity)
}
