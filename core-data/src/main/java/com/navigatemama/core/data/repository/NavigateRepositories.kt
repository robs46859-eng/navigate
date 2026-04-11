package com.navigatemama.core.data.repository

import androidx.lifecycle.LiveData
import androidx.lifecycle.map
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.firestore.DocumentSnapshot
import com.google.firebase.firestore.FieldValue
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.SetOptions
import com.navigatemama.core.database.entity.FavoriteEntity
import com.navigatemama.core.database.NavigateDatabase
import com.navigatemama.core.database.entity.ContractionEntity
import com.navigatemama.core.database.entity.JourneyEntryEntity
import com.navigatemama.core.database.entity.KickCountEntity
import com.navigatemama.core.database.entity.PlaceEntity
import com.navigatemama.core.database.entity.ReviewEntity
import com.navigatemama.core.database.entity.SleepSessionEntity
import com.navigatemama.core.database.entity.UserProfileEntity
import com.navigatemama.core.model.CommunityPost
import com.navigatemama.core.model.ContractionLog
import com.navigatemama.core.model.JourneyEntry
import com.navigatemama.core.model.KickCountLog
import com.navigatemama.core.model.Place
import com.navigatemama.core.model.PlaceCategory
import com.navigatemama.core.model.Review
import com.navigatemama.core.model.SleepSession
import com.navigatemama.core.model.UserProfile
import com.navigatemama.core.model.UserStage
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext
import java.util.UUID

class ProfileRepository(
    private val database: NavigateDatabase,
    private val firestore: FirebaseFirestore?,
    private val auth: FirebaseAuth?
) {
    fun observeProfile(): LiveData<UserProfile?> {
        return database.userProfileDao().observeProfile().map { entity -> entity?.toModel() }
    }

    suspend fun getProfileOnce(): UserProfile? = withContext(Dispatchers.IO) {
        database.userProfileDao().getProfile()?.toModel()
    }

    suspend fun ensureDefaultProfile() {
        if (database.userProfileDao().count() > 0) return
        val firebaseUser = auth?.currentUser
        if (firebaseUser != null && firestore != null) {
            syncFromFirestoreIfNeeded(firebaseUser)
            return
        }
        database.userProfileDao().upsert(
            UserProfileEntity(
                uid = "local-user",
                displayName = "Maya Thompson",
                email = "maya.denver@example.com",
                stage = UserStage.PREGNANT,
                dueDate = "2026-07-21",
                comfortRoutingEnabled = true,
                streakDays = 6
            )
        )
    }

    suspend fun updateComfortRouting(enabled: Boolean) {
        val current = database.userProfileDao().getProfile() ?: return
        val updated = current.copy(comfortRoutingEnabled = enabled)
        database.userProfileDao().upsert(updated)
        auth?.currentUser?.uid?.let { pushProfileToCloud(it, updated) }
    }

    suspend fun saveOnboardingProfile(
        displayName: String,
        email: String,
        stage: UserStage,
        dueDate: String?
    ) = withContext(Dispatchers.IO) {
        val uid = auth?.currentUser?.uid ?: "local-user"
        val entity = UserProfileEntity(
            uid = uid,
            displayName = displayName,
            email = email,
            stage = stage,
            dueDate = dueDate,
            comfortRoutingEnabled = true,
            streakDays = 0
        )
        database.userProfileDao().upsert(entity)
        if (uid != "local-user") {
            pushProfileToCloud(uid, entity)
        }
    }

    /**
     * Called when Firebase Auth reports a signed-in user. Loads [users/{uid}] from Firestore
     * or seeds from the previous local row, then persists to Room.
     */
    suspend fun syncFromFirestoreIfNeeded(user: FirebaseUser) = withContext(Dispatchers.IO) {
        if (firestore == null) return@withContext
        val current = database.userProfileDao().getProfile()
        if (current?.uid == user.uid) {
            return@withContext
        }
        val snap = firestore.collection("users").document(user.uid).get().await()
        val previous = current
        database.userProfileDao().clearAll()
        if (snap.exists()) {
            database.userProfileDao().upsert(entityFromFirestore(snap, user.uid, user.email))
        } else {
            val entity = UserProfileEntity(
                uid = user.uid,
                displayName = previous?.displayName ?: user.displayName ?: "Navigator",
                email = user.email ?: previous?.email.orEmpty(),
                stage = previous?.stage ?: UserStage.PREGNANT,
                dueDate = previous?.dueDate,
                comfortRoutingEnabled = previous?.comfortRoutingEnabled ?: true,
                streakDays = previous?.streakDays ?: 0
            )
            database.userProfileDao().upsert(entity)
            pushProfileToCloud(user.uid, entity)
        }
    }

    /**
     * Called when the user signs out of Firebase. Keeps a single offline row under [local-user].
     */
    suspend fun onSignedOut() = withContext(Dispatchers.IO) {
        val p = database.userProfileDao().getProfile() ?: return@withContext
        database.userProfileDao().clearAll()
        if (p.uid != "local-user") {
            database.userProfileDao().upsert(
                p.copy(uid = "local-user", email = "")
            )
        }
    }

    private suspend fun pushProfileToCloud(uid: String, entity: UserProfileEntity) {
        val fs = firestore ?: return
        val data = hashMapOf<String, Any?>(
            "displayName" to entity.displayName,
            "email" to entity.email,
            "stage" to entity.stage.name,
            "dueDate" to entity.dueDate,
            "comfortRoutingEnabled" to entity.comfortRoutingEnabled,
            "streakDays" to entity.streakDays,
            "updatedAt" to FieldValue.serverTimestamp()
        )
        fs.collection("users").document(uid).set(data, SetOptions.merge()).await()
    }

    private fun entityFromFirestore(snap: DocumentSnapshot, uid: String, emailFallback: String?): UserProfileEntity {
        val stageStr = snap.getString("stage") ?: "PREGNANT"
        val stage = runCatching { UserStage.valueOf(stageStr) }.getOrElse { UserStage.PREGNANT }
        return UserProfileEntity(
            uid = uid,
            displayName = snap.getString("displayName").orEmpty(),
            email = snap.getString("email") ?: emailFallback.orEmpty(),
            stage = stage,
            dueDate = snap.getString("dueDate"),
            comfortRoutingEnabled = snap.getBoolean("comfortRoutingEnabled") ?: true,
            streakDays = (snap.getLong("streakDays") ?: 0L).toInt()
        )
    }
}

class PlacesRepository(
    private val database: NavigateDatabase,
    private val firestore: FirebaseFirestore?
) {
    fun observePlaces(): LiveData<List<Place>> {
        return database.placeDao().observePlaces().map { list -> list.map { entity -> entity.toModel() } }
    }

    fun observePlace(placeId: String): LiveData<Place?> {
        return database.placeDao().observePlace(placeId).map { entity -> entity?.toModel() }
    }

    fun observeReviews(placeId: String): LiveData<List<Review>> {
        return database.reviewDao().observeReviews(placeId).map { list -> list.map { entity -> entity.toModel() } }
    }

    fun observeFavoritePlaceIds(): LiveData<Set<String>> {
        return database.favoriteDao().observeFavoritePlaceIds().map { ids -> ids.toSet() }
    }

    fun observeFavorite(placeId: String): LiveData<Boolean> {
        return database.favoriteDao().observeIsFavorite(placeId)
    }

    suspend fun toggleFavorite(placeId: String) = withContext(Dispatchers.IO) {
        val dao = database.favoriteDao()
        if (dao.isFavorite(placeId)) {
            dao.deleteByPlaceId(placeId)
        } else {
            dao.insert(FavoriteEntity(placeId = placeId, savedAtMillis = System.currentTimeMillis()))
        }
    }

    suspend fun seedIfEmpty() = withContext(Dispatchers.IO) {
        if (database.placeDao().count() == 0) {
            database.placeDao().replaceAll(seedPlaces())
            seedReviews().forEach { database.reviewDao().upsert(it) }
        }
        if (database.journeyDao().count() == 0) {
            database.journeyDao().replaceAll(seedJourney())
        }
    }

    suspend fun syncPlacesFromFirestore() = withContext(Dispatchers.IO) {
        val source = firestore ?: return@withContext
        runCatching {
            val snapshot = source.collection("places").get().await()
            val remotePlaces = snapshot.documents.mapNotNull { document ->
                val categoryName = document.getString("category")?.uppercase() ?: return@mapNotNull null
                val category = runCatching { PlaceCategory.valueOf(categoryName) }.getOrNull() ?: return@mapNotNull null
                PlaceEntity(
                    id = document.id,
                    name = document.getString("name").orEmpty(),
                    address = document.getString("address").orEmpty(),
                    category = category,
                    latitude = document.getDouble("lat") ?: 0.0,
                    longitude = document.getDouble("lng") ?: 0.0,
                    source = document.getString("source").orEmpty(),
                    rating = document.getDouble("rating") ?: 4.5,
                    reviewCount = (document.getLong("reviewCount") ?: 0L).toInt(),
                    description = document.getString("description").orEmpty(),
                    hours = document.getString("hours").orEmpty(),
                    phone = document.getString("phone"),
                    websiteUrl = document.getString("websiteUrl"),
                    avgCleanliness = document.getDouble("avgCleanliness") ?: 4.5,
                    avgPrivacy = document.getDouble("avgPrivacy") ?: 4.3,
                    strollerAccessRate = document.getDouble("strollerAccessRate") ?: 0.9
                )
            }
            if (remotePlaces.isNotEmpty()) {
                database.placeDao().replaceAll(remotePlaces)
            }
        }
    }

    suspend fun addReview(
        placeId: String,
        authorUid: String,
        authorName: String,
        rating: Int,
        cleanliness: Int,
        privacy: Int,
        strollerAccess: Boolean,
        notes: String
    ) = withContext(Dispatchers.IO) {
        database.reviewDao().upsert(
            ReviewEntity(
                id = UUID.randomUUID().toString(),
                placeId = placeId,
                authorUid = authorUid,
                authorName = authorName,
                rating = rating,
                cleanliness = cleanliness,
                privacy = privacy,
                strollerAccess = strollerAccess,
                notes = notes,
                createdAt = System.currentTimeMillis()
            )
        )
    }
}

class JourneyRepository(
    private val database: NavigateDatabase
) {
    fun observeJourney(): LiveData<List<JourneyEntry>> {
        return database.journeyDao().observeEntries().map { list -> list.map { entity -> entity.toModel() } }
    }

    suspend fun updateMood(week: Int, mood: Int?) {
        database.journeyDao().updateMood(week, mood)
    }
}

class WellnessRepository(
    private val database: NavigateDatabase
) {
    fun observeContractions(): LiveData<List<ContractionLog>> =
        database.wellnessDao().observeContractions().map { list -> list.map { entity -> entity.toModel() } }

    fun observeKickCounts(): LiveData<List<KickCountLog>> =
        database.wellnessDao().observeKickCounts().map { list -> list.map { entity -> entity.toModel() } }

    fun observeSleepSessions(): LiveData<List<SleepSession>> =
        database.wellnessDao().observeSleepSessions().map { list -> list.map { entity -> entity.toModel() } }

    suspend fun saveContraction(log: ContractionLog) {
        database.wellnessDao().upsertContraction(
            ContractionEntity(
                id = log.id,
                startTime = log.startTime,
                endTime = log.endTime,
                durationSeconds = log.durationSeconds,
                intervalSeconds = log.intervalSeconds,
                intensity = log.intensity
            )
        )
    }

    suspend fun saveKickCount(log: KickCountLog) {
        database.wellnessDao().upsertKickCount(
            KickCountEntity(
                id = log.id,
                startTime = log.startTime,
                endTime = log.endTime,
                count = log.count,
                durationMinutes = log.durationMinutes
            )
        )
    }

    suspend fun saveSleepSession(session: SleepSession) {
        database.wellnessDao().upsertSleepSession(
            SleepSessionEntity(
                id = session.id,
                startTime = session.startTime,
                endTime = session.endTime,
                quality = session.quality,
                notes = session.notes
            )
        )
    }
}

object CommunitySeed {
    fun posts(): List<CommunityPost> = listOf(
        CommunityPost(
            id = "comm-1",
            author = "Ariana R.",
            title = "Best stroller-friendly coffee stop near City Park?",
            content = "Looking for a spot with a changing table and room to park a Vista without blocking the aisle.",
            category = "Community",
            postedAt = "2h ago",
            replies = 14,
            likes = 28
        ),
        CommunityPost(
            id = "comm-2",
            author = "Jasmine M.",
            title = "Denver Health triage wait time this morning was under 20 minutes",
            content = "Sharing in case anyone is deciding between urgent care and the ER for a pediatric fever check.",
            category = "Health",
            postedAt = "5h ago",
            replies = 9,
            likes = 36
        ),
        CommunityPost(
            id = "comm-3",
            author = "Leah P.",
            title = "Cherry Creek family lounge has a new bottle warmer",
            content = "It worked well and the seating was clean. The nursing cubicles were quiet even during the lunch rush.",
            category = "Tips",
            postedAt = "1d ago",
            replies = 7,
            likes = 22
        )
    )
}

private fun UserProfileEntity.toModel() = UserProfile(
    uid = uid,
    displayName = displayName,
    email = email,
    stage = stage,
    dueDate = dueDate,
    comfortRoutingEnabled = comfortRoutingEnabled,
    streakDays = streakDays
)

private fun PlaceEntity.toModel() = Place(
    id = id,
    name = name,
    address = address,
    category = category,
    latitude = latitude,
    longitude = longitude,
    source = source,
    rating = rating,
    reviewCount = reviewCount,
    description = description,
    hours = hours,
    phone = phone,
    websiteUrl = websiteUrl,
    avgCleanliness = avgCleanliness,
    avgPrivacy = avgPrivacy,
    strollerAccessRate = strollerAccessRate
)

private fun ReviewEntity.toModel() = Review(
    id = id,
    placeId = placeId,
    authorUid = authorUid,
    authorName = authorName,
    rating = rating,
    cleanliness = cleanliness,
    privacy = privacy,
    strollerAccess = strollerAccess,
    notes = notes,
    createdAt = createdAt
)

private fun JourneyEntryEntity.toModel() = JourneyEntry(
    week = week,
    babySize = babySize,
    fact = fact,
    tip = tip,
    mood = mood
)

private fun ContractionEntity.toModel() = ContractionLog(
    id = id,
    startTime = startTime,
    endTime = endTime,
    durationSeconds = durationSeconds,
    intervalSeconds = intervalSeconds,
    intensity = intensity
)

private fun KickCountEntity.toModel() = KickCountLog(
    id = id,
    startTime = startTime,
    endTime = endTime,
    count = count,
    durationMinutes = durationMinutes
)

private fun SleepSessionEntity.toModel() = SleepSession(
    id = id,
    startTime = startTime,
    endTime = endTime,
    quality = quality,
    notes = notes
)

private fun seedPlaces() = listOf(
    PlaceEntity(
        id = "rose-medical-center",
        name = "Rose Medical Center",
        address = "4567 E 9th Ave, Denver, CO 80220",
        category = PlaceCategory.HOSPITAL,
        latitude = 39.7316,
        longitude = -104.9324,
        source = "Curated Denver maternal guide",
        rating = 4.6,
        reviewCount = 132,
        description = "Full-service hospital with labor and delivery, NICU access, and valet drop-off close to maternity triage.",
        hours = "Open 24 hours",
        phone = "(303) 320-2121",
        websiteUrl = "https://www.rosemed.com",
        avgCleanliness = 4.7,
        avgPrivacy = 4.5,
        strollerAccessRate = 0.94
    ),
    PlaceEntity(
        id = "denver-health",
        name = "Denver Health Emergency Department",
        address = "777 Bannock St, Denver, CO 80204",
        category = PlaceCategory.URGENT_CARE,
        latitude = 39.7286,
        longitude = -104.9913,
        source = "Curated Denver maternal guide",
        rating = 4.2,
        reviewCount = 89,
        description = "Downtown emergency and urgent care option with direct access from Bannock and strong public transit coverage.",
        hours = "Open 24 hours",
        phone = "(303) 436-6000",
        websiteUrl = "https://www.denverhealth.org",
        avgCleanliness = 4.2,
        avgPrivacy = 4.0,
        strollerAccessRate = 0.9
    ),
    PlaceEntity(
        id = "union-station-family-restroom",
        name = "Union Station Family Restroom",
        address = "1701 Wynkoop St, Denver, CO 80202",
        category = PlaceCategory.RESTROOM,
        latitude = 39.7527,
        longitude = -105.0002,
        source = "Crowdsourced",
        rating = 4.5,
        reviewCount = 41,
        description = "Reliable downtown stop with wider stalls, sink access, and easy elevator connection from the train platforms.",
        hours = "5:00 AM - 12:00 AM",
        phone = null,
        websiteUrl = "https://unionstationindenver.com",
        avgCleanliness = 4.4,
        avgPrivacy = 4.1,
        strollerAccessRate = 0.95
    ),
    PlaceEntity(
        id = "cherry-creek-family-lounge",
        name = "Cherry Creek Shopping Center Family Lounge",
        address = "3000 E 1st Ave, Denver, CO 80206",
        category = PlaceCategory.NURSING_ROOM,
        latitude = 39.7177,
        longitude = -104.9521,
        source = "Crowdsourced",
        rating = 4.8,
        reviewCount = 57,
        description = "Dedicated family lounge with rocker seating, dim lighting, changing tables, and bottle-warming access.",
        hours = "10:00 AM - 8:00 PM",
        phone = "(303) 388-3900",
        websiteUrl = "https://www.shopcherrycreek.com",
        avgCleanliness = 4.8,
        avgPrivacy = 4.9,
        strollerAccessRate = 0.98
    ),
    PlaceEntity(
        id = "museum-family-restroom",
        name = "Denver Museum of Nature & Science Family Restroom",
        address = "2001 Colorado Blvd, Denver, CO 80205",
        category = PlaceCategory.CHANGING_STATION,
        latitude = 39.7486,
        longitude = -104.9425,
        source = "Crowdsourced",
        rating = 4.7,
        reviewCount = 33,
        description = "Quiet family restroom near the Discovery Zone with strong stroller access and spacious counters for quick changes.",
        hours = "9:00 AM - 5:00 PM",
        phone = "(303) 370-6000",
        websiteUrl = "https://www.dmns.org",
        avgCleanliness = 4.7,
        avgPrivacy = 4.4,
        strollerAccessRate = 0.97
    ),
    PlaceEntity(
        id = "wash-park-playground",
        name = "Washington Park Playground",
        address = "701 S Franklin St, Denver, CO 80209",
        category = PlaceCategory.PLAYGROUND,
        latitude = 39.7026,
        longitude = -104.9682,
        source = "Curated Denver maternal guide",
        rating = 4.6,
        reviewCount = 73,
        description = "Playground with shaded benches, nearby restrooms, and smooth stroller paths around Smith Lake.",
        hours = "5:00 AM - 11:00 PM",
        phone = null,
        websiteUrl = "https://www.denvergov.org",
        avgCleanliness = 4.1,
        avgPrivacy = 3.8,
        strollerAccessRate = 0.96
    )
)

private fun seedReviews() = listOf(
    ReviewEntity(
        id = "rev-1",
        placeId = "cherry-creek-family-lounge",
        authorUid = "u-1",
        authorName = "Jade",
        rating = 5,
        cleanliness = 5,
        privacy = 5,
        strollerAccess = true,
        notes = "Quiet enough for pumping during a crowded Saturday and the rocker chairs were actually comfortable.",
        createdAt = System.currentTimeMillis() - 86_400_000
    ),
    ReviewEntity(
        id = "rev-2",
        placeId = "union-station-family-restroom",
        authorUid = "u-2",
        authorName = "Morgan",
        rating = 4,
        cleanliness = 4,
        privacy = 4,
        strollerAccess = true,
        notes = "Easy for a quick downtown pit stop before the A-line, but the afternoon rush can make it busy.",
        createdAt = System.currentTimeMillis() - 172_800_000
    ),
    ReviewEntity(
        id = "rev-3",
        placeId = "rose-medical-center",
        authorUid = "u-3",
        authorName = "Priya",
        rating = 5,
        cleanliness = 5,
        privacy = 4,
        strollerAccess = true,
        notes = "Labor triage team was calm and fast, and valet got us close to the right entrance.",
        createdAt = System.currentTimeMillis() - 259_200_000
    )
)

private fun seedJourney(): List<JourneyEntryEntity> {
    val milestones = mapOf(
        8 to Pair("Raspberry", "Core organs are forming and tiny arm buds are moving."),
        12 to Pair("Lime", "Baby's kidneys are making urine and reflexes are getting stronger."),
        20 to Pair("Banana", "Halfway there. Baby can swallow and hear more of your voice."),
        28 to Pair("Eggplant", "Eyes can open and close and sleep cycles are getting more regular."),
        34 to Pair("Cantaloupe", "Lungs are maturing and fat stores are building for life outside the womb."),
        40 to Pair("Pumpkin", "Full term. Baby is ready for birth and still gaining a little weight.")
    )
    return (1..40).map { week ->
        val (size, fact) = milestones[week] ?: Pair("Growing little bean", "This week is focused on steady growth, circulation, and strengthening.")
        JourneyEntryEntity(
            week = week,
            babySize = size,
            fact = fact,
            tip = when {
                week < 14 -> "Hydrate early in the day and keep snacks nearby to stay ahead of nausea."
                week < 28 -> "Add a short walk after meals to support circulation and energy."
                else -> "Keep your hospital bag and birth preferences easy to grab by the door."
            },
            mood = null
        )
    }
}
