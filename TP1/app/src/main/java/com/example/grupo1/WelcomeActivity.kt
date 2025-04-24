package com.example.grupo1

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.*
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity

class WelcomeActivity : AppCompatActivity() {

    private lateinit var imgPlatformLogo: ImageView
    private lateinit var etOtraPreferencia: EditText

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_welcome)


        val usuario = intent.getStringExtra("usuario")
        val tvWelcome = findViewById<TextView>(R.id.tvWelcome)
        tvWelcome.text = "¡Bienvenido/a, $usuario!"


        val rgPlatform = findViewById<RadioGroup>(R.id.rgPlatform)
        imgPlatformLogo = findViewById(R.id.imgPlatformLogo)

        rgPlatform.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.rbAndroid -> imgPlatformLogo.setImageResource(R.drawable.android_logo)
                R.id.rbIOS -> imgPlatformLogo.setImageResource(R.drawable.ioslogo)
            }
        }


        val cbOtra = findViewById<CheckBox>(R.id.cbOtra)
        etOtraPreferencia = findViewById(R.id.etOtraPreferencia)

        cbOtra.setOnCheckedChangeListener { _, isChecked ->
            etOtraPreferencia.visibility = if (isChecked) View.VISIBLE else View.GONE
        }


        val btnContinuar = findViewById<Button>(R.id.btnContinuar)
        btnContinuar.setOnClickListener {
            val selectedPlatformId = rgPlatform.checkedRadioButtonId

            val cbProgramacion = findViewById<CheckBox>(R.id.cbProgramacion)
            val cbRedes = findViewById<CheckBox>(R.id.cbRedes)
            val cbSeguridad = findViewById<CheckBox>(R.id.cbSeguridad)
            val cbHardware = findViewById<CheckBox>(R.id.cbHardware)
            val cbOtra = findViewById<CheckBox>(R.id.cbOtra)
            val otraPreferenciaTexto = etOtraPreferencia.text.toString().trim()

            // Validar selección de plataforma
            if (selectedPlatformId == -1) {
                Toast.makeText(this, "Por favor, seleccione una plataforma", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Validar al menos una preferencia seleccionada
            val algunaSeleccionada = cbProgramacion.isChecked || cbRedes.isChecked ||
                    cbSeguridad.isChecked || cbHardware.isChecked || cbOtra.isChecked

            if (!algunaSeleccionada) {
                Toast.makeText(this, "Por favor, seleccione al menos una preferencia", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Validar campo "Otra" si está seleccionada
            if (cbOtra.isChecked && otraPreferenciaTexto.isEmpty()) {
                Toast.makeText(this, "Por favor, complete su preferencia en el campo 'Otra'", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            // Todo pasó bien
            Toast.makeText(this, "Gracias por elegir tus preferencias", Toast.LENGTH_SHORT).show()
        }






        val btnCerrarSesion = findViewById<Button>(R.id.btnCerrarSesion)
        btnCerrarSesion.setOnClickListener {
            mostrarDialogoConfirmacion()
        }
    }

    private fun mostrarDialogoConfirmacion() {
        AlertDialog.Builder(this)
            .setTitle("Cerrar Sesión")
            .setMessage("¿Está seguro que desea cerrar la sesión?")
            .setPositiveButton("Sí") { _, _ ->
                // Si el usuario confirma, volvemos a la pantalla de inicio de sesión
                val intent = Intent(this, MainActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
                startActivity(intent)
                finish()
            }
            .setNegativeButton("No", null) // No hace nada si el usuario cancela
            .setIcon(android.R.drawable.ic_dialog_alert)
            .show()
    }
}