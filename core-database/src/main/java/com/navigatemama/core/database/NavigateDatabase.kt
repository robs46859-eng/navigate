package com.navigatemama.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.navigatemama.core.database.dao.FavoriteDao
import com.navigatemama.core.database.dao.JourneyDao
import com.navigatemama.core.database.dao.PlaceDao
import com.navigatemama.core.database.dao.ReviewDao
import com.navigatemama.core.database.dao.UserProfileDao
import com.navigatemama.core.database.dao.WellnessDao
import com.navigatemama.core.database.entity.ContractionEntity
import com.navigatemama.core.database.entity.FavoriteEntity
import com.navigatemama.core.database.entity.JourneyEntryEntity
import com.navigatemama.core.database.entity.KickCountEntity
import com.navigatemama.core.database.entity.PlaceEntity
import com.navigatemama.core.database.entity.ReviewEntity
import com.navigatemama.core.database.entity.SleepSessionEntity
import com.navigatemama.core.database.entity.UserProfileEntity

@Database(
    entities = [
        UserProfileEntity::class,
        PlaceEntity::class,
        FavoriteEntity::class,
        ReviewEntity::class,
        JourneyEntryEntity::class,
        ContractionEntity::class,
        KickCountEntity::class,
        SleepSessionEntity::class
    ],
    version = 2,
    exportSchema = false
)
@TypeConverters(NavigateTypeConverters::class)
abstract class NavigateDatabase : RoomDatabase() {
    abstract fun userProfileDao(): UserProfileDao
    abstract fun placeDao(): PlaceDao
    abstract fun favoriteDao(): FavoriteDao
    abstract fun reviewDao(): ReviewDao
    abstract fun journeyDao(): JourneyDao
    abstract fun wellnessDao(): WellnessDao

    companion object {
        @Volatile
        private var INSTANCE: NavigateDatabase? = null

        fun getInstance(context: Context): NavigateDatabase {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: Room.databaseBuilder(
                    context.applicationContext,
                    NavigateDatabase::class.java,
                    "navigate_mama.db"
                ).fallbackToDestructiveMigration().build().also { INSTANCE = it }
            }
        }
    }
}
