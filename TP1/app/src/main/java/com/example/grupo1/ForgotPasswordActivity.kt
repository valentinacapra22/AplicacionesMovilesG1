package com.example.grupo1

import android.os.Bundle
import android.util.Patterns
import android.widget.*
import androidx.appcompat.app.AppCompatActivity

class ForgotPasswordActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_forgot_password)

        val etEmail = findViewById<EditText>(R.id.etEmail)
        val btnEnviarCodigo = findViewById<Button>(R.id.btnEnviarCodigo)
        val tvMensaje = findViewById<TextView>(R.id.tvMensaje)
        val tvReenviar = findViewById<TextView>(R.id.tvReenviar)
        val btnVolver = findViewById<Button>(R.id.btnVolver)

        btnEnviarCodigo.setOnClickListener {
            val email = etEmail.text.toString().trim()

            if (email.isEmpty()) {
                Toast.makeText(this, "Por favor, ingresá tu email", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Ingresá un correo electrónico válido", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            tvMensaje.text = "Se envió un código a $email"
            tvMensaje.visibility = TextView.VISIBLE
            tvReenviar.visibility = TextView.VISIBLE
        }

        tvReenviar.setOnClickListener {
            val email = etEmail.text.toString().trim()

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(this, "Ingresá un correo válido para reenviar el código", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            Toast.makeText(this, "Se volvió a enviar el código a $email", Toast.LENGTH_SHORT).show()
        }

        btnVolver.setOnClickListener {
            finish()
        }
    }
}
