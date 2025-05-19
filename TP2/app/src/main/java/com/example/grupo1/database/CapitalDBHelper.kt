package com.example.grupo1.database

import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import com.example.grupo1.models.Capital

class CapitalDBHelper(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        const val DATABASE_NAME = "capitals.db"
        const val DATABASE_VERSION = 1
        const val TABLE_NAME = "capitals"
        const val COLUMN_ID = "id"
        const val COLUMN_COUNTRY = "country"
        const val COLUMN_CAPITAL = "capital"
        const val COLUMN_POPULATION = "population"
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(
            """
            CREATE TABLE $TABLE_NAME (
                $COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $COLUMN_COUNTRY TEXT NOT NULL,
                $COLUMN_CAPITAL TEXT NOT NULL,
                $COLUMN_POPULATION INTEGER NOT NULL
            )
        """.trimIndent()
        )
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }

    fun addCapital(capital: Capital): Long {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COLUMN_COUNTRY, capital.country)
            put(COLUMN_CAPITAL, capital.capitalName)
            put(COLUMN_POPULATION, capital.population)
        }
        return db.insert(TABLE_NAME, null, values)
    }

    fun getAllCapitals(): List<Capital> {
        val capitals = mutableListOf<Capital>()
        val cursor: Cursor = readableDatabase.query(
            TABLE_NAME, null, null, null, null, null, null
        )

        with(cursor) {
            while (moveToNext()) {
                capitals.add(
                    Capital(
                        getLong(getColumnIndexOrThrow(COLUMN_ID)),
                        getString(getColumnIndexOrThrow(COLUMN_COUNTRY)),
                        getString(getColumnIndexOrThrow(COLUMN_CAPITAL)),
                        getInt(getColumnIndexOrThrow(COLUMN_POPULATION))
                    )
                )
            }
            close()
        }

        return capitals
    }

    fun deleteCapital(id: Long): Int {
        return writableDatabase.delete(
            TABLE_NAME,
            "$COLUMN_ID = ?",
            arrayOf(id.toString())
        )
    }

    fun updatePopulation(id: Long, newPopulation: Int): Int {
        val values = ContentValues().apply {
            put(COLUMN_POPULATION, newPopulation)
        }
        return writableDatabase.update(
            TABLE_NAME,
            values,
            "$COLUMN_ID = ?",
            arrayOf(id.toString())
        )
    }

    fun deleteCapitalsByCountry(country: String): Int {
        return writableDatabase.delete(
            TABLE_NAME,
            "$COLUMN_COUNTRY = ?",
            arrayOf(country)
        )
    }

    fun deleteCapitalByName(name: String): Boolean {
        val db = writableDatabase
        val deletedRows = db.delete(
            TABLE_NAME,  // ← cambiado
            "$COLUMN_CAPITAL = ?",  // ← cambiado
            arrayOf(name)
        )
        db.close()
        return deletedRows > 0
    }

    fun updatePopulationByName(name: String, newPopulation: Int): Boolean {
        val db = writableDatabase
        val values = ContentValues().apply {
            put(COLUMN_POPULATION, newPopulation)
        }

        val updatedRows = db.update(
            TABLE_NAME,  // ← cambiado
            values,
            "$COLUMN_CAPITAL = ?",  // ← cambiado
            arrayOf(name)
        )
        db.close()
        return updatedRows > 0
    }

}
