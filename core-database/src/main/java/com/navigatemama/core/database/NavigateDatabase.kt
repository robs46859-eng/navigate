package com.navigatemama.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase
import com.navigatemama.core.database.dao.ChildDao
import com.navigatemama.core.database.dao.FavoriteDao
import com.navigatemama.core.database.dao.JourneyDao
import com.navigatemama.core.database.dao.PlaceDao
import com.navigatemama.core.database.dao.ReviewDao
import com.navigatemama.core.database.dao.UserProfileDao
import com.navigatemama.core.database.dao.WellnessDao
import com.navigatemama.core.database.entity.CareEventEntity
import com.navigatemama.core.database.entity.ChildProfileEntity
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
        ChildProfileEntity::class,
        CareEventEntity::class,
        FavoriteEntity::class,
        ReviewEntity::class,
        JourneyEntryEntity::class,
        ContractionEntity::class,
        KickCountEntity::class,
        SleepSessionEntity::class
    ],
    version = 3,
    exportSchema = false
)
@TypeConverters(NavigateTypeConverters::class)
abstract class NavigateDatabase : RoomDatabase() {
    abstract fun userProfileDao(): UserProfileDao
    abstract fun placeDao(): PlaceDao
    abstract fun childDao(): ChildDao
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
                )
                    .addMigrations(MIGRATION_2_3)
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { INSTANCE = it }
            }
        }

        private val MIGRATION_2_3 = object : Migration(2, 3) {
            override fun migrate(db: SupportSQLiteDatabase) {
                db.execSQL(
                    """
                    CREATE TABLE IF NOT EXISTS `children` (
                        `id` TEXT NOT NULL,
                        `name` TEXT NOT NULL,
                        `birthDate` TEXT NOT NULL,
                        `stageLabel` TEXT NOT NULL,
                        `pediatrician` TEXT,
                        `allergies` TEXT,
                        `notes` TEXT,
                        PRIMARY KEY(`id`)
                    )
                    """.trimIndent()
                )
                db.execSQL(
                    """
                    CREATE TABLE IF NOT EXISTS `care_events` (
                        `id` TEXT NOT NULL,
                        `childId` TEXT NOT NULL,
                        `type` TEXT NOT NULL,
                        `title` TEXT NOT NULL,
                        `occurredAt` INTEGER NOT NULL,
                        `notes` TEXT,
                        PRIMARY KEY(`id`),
                        FOREIGN KEY(`childId`) REFERENCES `children`(`id`) ON UPDATE NO ACTION ON DELETE CASCADE
                    )
                    """.trimIndent()
                )
                db.execSQL("CREATE INDEX IF NOT EXISTS `index_care_events_childId` ON `care_events` (`childId`)")
            }
        }
    }
}
