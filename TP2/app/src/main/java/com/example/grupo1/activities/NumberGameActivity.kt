package com.example.grupo1.activities

import android.content.Context
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.grupo1.R
import kotlin.random.Random

class NumberGameActivity : AppCompatActivity() {

    private lateinit var tvCurrentScore: TextView
    private lateinit var tvHighScore: TextView
    private lateinit var etUserGuess: EditText
    private lateinit var btnGuess: Button
    private lateinit var tvResult: TextView
    private lateinit var btnBack: Button

    private var currentScore = 0
    private var highScore = 0
    private var failedAttempts = 0

    private val prefs by lazy {
        getSharedPreferences("game_prefs", Context.MODE_PRIVATE)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_number_game)

        tvCurrentScore = findViewById(R.id.tvCurrentScore)
        tvHighScore = findViewById(R.id.tvHighScore)
        etUserGuess = findViewById(R.id.etUserGuess)
        btnGuess = findViewById(R.id.btnGuess)
        tvResult = findViewById(R.id.tvResult)
        btnBack = findViewById(R.id.btnBack)

        highScore = prefs.getInt("HIGH_SCORE", 0)
        updateScoreLabels()

        btnGuess.setOnClickListener {
            val userInput = etUserGuess.text.toString()
            if (userInput.isEmpty()) {
                Toast.makeText(this, "Ingresá un número", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val userGuess = userInput.toInt()
            if (userGuess !in 1..5) {
                Toast.makeText(this, "Ingresá un número del 1 al 5", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val randomNumber = Random.nextInt(1, 6) // genera entre 1 y 5

            if (userGuess == randomNumber) {
                currentScore += 10
                tvResult.text = "¡Correcto! Era $randomNumber"
                failedAttempts = 0
            } else {
                failedAttempts++
                tvResult.text = "Incorrecto. Era $randomNumber"
                if (failedAttempts >= 5) {
                    Toast.makeText(this, "Perdiste, se reinicia el puntaje", Toast.LENGTH_LONG).show()
                    currentScore = 0
                    failedAttempts = 0
                }
            }

            // Actualizar high score si es necesario
            if (currentScore > highScore) {
                highScore = currentScore
                prefs.edit().putInt("HIGH_SCORE", highScore).apply()
            }

            updateScoreLabels()
            etUserGuess.text.clear()
        }

        btnBack.setOnClickListener {
            finish()
        }
    }

    private fun updateScoreLabels() {
        tvCurrentScore.text = "Puntaje actual: $currentScore"
        tvHighScore.text = "Máximo puntaje: $highScore"
    }
}
