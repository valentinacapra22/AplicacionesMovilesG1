package com.example.grupo1.activities

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.grupo1.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnNumberGame.setOnClickListener {
            startActivity(Intent(this, NumberGameActivity::class.java))
        }

        binding.btnCapitals.setOnClickListener {
            startActivity(Intent(this, CapitalsActivity::class.java))
        }
    }
}