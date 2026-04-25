package com.navigatemama.app.shared

import android.content.Context
import com.navigatemama.core.data.firebase.FirebaseProviders
import com.navigatemama.core.data.repository.AuthRepository
import com.navigatemama.core.data.repository.ChildRepository
import com.navigatemama.core.data.repository.JourneyRepository
import com.navigatemama.core.data.repository.PlacesRepository
import com.navigatemama.core.data.repository.ProfileRepository
import com.navigatemama.core.data.repository.WellnessRepository
import com.navigatemama.core.database.NavigateDatabase

object ServiceLocator {
    @Volatile
    private var database: NavigateDatabase? = null

    private fun database(context: Context): NavigateDatabase {
        return database ?: synchronized(this) {
            database ?: NavigateDatabase.getInstance(context).also { database = it }
        }
    }

    fun profileRepository(context: Context): ProfileRepository =
        ProfileRepository(
            database(context),
            FirebaseProviders.firestoreOrNull(context),
            FirebaseProviders.authOrNull(context)
        )

    fun authRepository(context: Context): AuthRepository =
        AuthRepository(FirebaseProviders.authOrNull(context))

    fun placesRepository(context: Context): PlacesRepository =
        PlacesRepository(database(context), FirebaseProviders.firestoreOrNull(context))

    fun childRepository(context: Context): ChildRepository =
        ChildRepository(database(context))

    fun journeyRepository(context: Context): JourneyRepository =
        JourneyRepository(database(context))

    fun wellnessRepository(context: Context): WellnessRepository =
        WellnessRepository(database(context))
}
