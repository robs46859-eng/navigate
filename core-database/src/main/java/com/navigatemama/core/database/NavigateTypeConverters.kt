package com.navigatemama.core.database

import androidx.room.TypeConverter
import com.navigatemama.core.model.PlaceCategory
import com.navigatemama.core.model.UserStage

class NavigateTypeConverters {
    @TypeConverter
    fun fromUserStage(value: UserStage): String = value.name

    @TypeConverter
    fun toUserStage(value: String): UserStage = UserStage.valueOf(value)

    @TypeConverter
    fun fromPlaceCategory(value: PlaceCategory): String = value.name

    @TypeConverter
    fun toPlaceCategory(value: String): PlaceCategory = PlaceCategory.valueOf(value)
}
