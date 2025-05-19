package com.example.grupo1.activities

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.text.InputType
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.grupo1.adapters.CapitalsAdapter
import com.example.grupo1.database.CapitalDBHelper
import com.example.grupo1.databinding.ActivityCapitalsBinding
import com.example.grupo1.models.Capital

class CapitalsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCapitalsBinding
    private lateinit var dbHelper: CapitalDBHelper
    private lateinit var adapter: CapitalsAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCapitalsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        dbHelper = CapitalDBHelper(this)
        setupRecyclerView()

        binding.fabAddCapital.setOnClickListener {
            showAddCapitalDialog()
        }

        binding.btnSearch.setOnClickListener {
            showSearchDialog()
        }

        binding.btnDeleteByCountry.setOnClickListener {
            showDeleteByCountryDialog()
        }

        binding.btnDeleteByName.setOnClickListener {
            showDeleteByCityNameDialog()
        }
        binding.btnEditByName.setOnClickListener {
            showEditPopulationByNameDialog()
        }

        binding.btnBack.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
            finish()
        }

    }

    private fun setupRecyclerView() {
        val capitals = dbHelper.getAllCapitals()
        adapter = CapitalsAdapter(capitals) { capital ->
            showCapitalOptions(capital)
        }

        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@CapitalsActivity)
            adapter = this@CapitalsActivity.adapter
        }
    }

    private fun refreshList() {
        adapter = CapitalsAdapter(dbHelper.getAllCapitals()) { capital ->
            showCapitalOptions(capital)
        }
        binding.recyclerView.adapter = adapter
    }

    private fun showAddCapitalDialog() {
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        val inputCountry = EditText(this).apply { hint = "País" }
        val inputCapital = EditText(this).apply { hint = "Capital" }
        val inputPopulation = EditText(this).apply {
            hint = "Población"
            inputType = InputType.TYPE_CLASS_NUMBER
        }

        layout.addView(inputCountry)
        layout.addView(inputCapital)
        layout.addView(inputPopulation)

        AlertDialog.Builder(this)
            .setTitle("Nueva Capital")
            .setView(layout)
            .setPositiveButton("Agregar") { _, _ ->
                val country = inputCountry.text.toString()
                val capitalName = inputCapital.text.toString()
                val population = inputPopulation.text.toString().toIntOrNull() ?: 0

                val capital = Capital(0, country, capitalName, population)
                dbHelper.addCapital(capital)
                refreshList()
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun showSearchDialog() {
        val input = EditText(this).apply { hint = "Nombre de la capital" }

        AlertDialog.Builder(this)
            .setTitle("Buscar Capital")
            .setView(input)
            .setPositiveButton("Buscar") { _, _ ->
                val name = input.text.toString()
                val result = dbHelper.getAllCapitals().find { it.capitalName.equals(name, ignoreCase = true) }

                if (result != null) {
                    Toast.makeText(this, "Capital encontrada: ${result.capitalName} (${result.country})", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(this, "No se encontró la capital", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun showDeleteByCountryDialog() {
        val input = EditText(this).apply { hint = "Nombre del país" }

        AlertDialog.Builder(this)
            .setTitle("Eliminar ciudades por país")
            .setView(input)
            .setPositiveButton("Eliminar") { _, _ ->
                val country = input.text.toString()
                val count = dbHelper.deleteCapitalsByCountry(country)
                Toast.makeText(this, "Se eliminaron $count ciudades", Toast.LENGTH_SHORT).show()
                refreshList()
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun showCapitalOptions(capital: Capital) {
        AlertDialog.Builder(this)
            .setTitle(capital.capitalName)
            .setItems(arrayOf("Editar población", "Eliminar")) { _, which ->
                when (which) {
                    0 -> showEditPopulationDialog(capital)
                    1 -> {
                        dbHelper.deleteCapital(capital.id)
                        refreshList()
                    }
                }
            }
            .show()
    }

    private fun showEditPopulationDialog(capital: Capital) {
        val input = EditText(this).apply {
            hint = "Nueva población"
            inputType = InputType.TYPE_CLASS_NUMBER
        }

        AlertDialog.Builder(this)
            .setTitle("Editar población de ${capital.capitalName}")
            .setView(input)
            .setPositiveButton("Guardar") { _, _ ->
                val newPop = input.text.toString().toIntOrNull()
                if (newPop != null) {
                    dbHelper.updatePopulation(capital.id, newPop)
                    refreshList()
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun showDeleteByCityNameDialog() {
        val input = EditText(this).apply { hint = "Nombre de la ciudad" }

        AlertDialog.Builder(this)
            .setTitle("Eliminar ciudad por nombre")
            .setView(input)
            .setPositiveButton("Eliminar") { _, _ ->
                val name = input.text.toString()
                val deleted = dbHelper.deleteCapitalByName(name)
                if (deleted) {
                    Toast.makeText(this, "Ciudad eliminada", Toast.LENGTH_SHORT).show()
                    refreshList()
                } else {
                    Toast.makeText(this, "No se encontró la ciudad", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun showEditPopulationByNameDialog() {
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(20, 20, 20, 20)
        }

        val inputName = EditText(this).apply { hint = "Nombre de la ciudad" }
        val inputPopulation = EditText(this).apply {
            hint = "Nueva población"
            inputType = InputType.TYPE_CLASS_NUMBER
        }

        layout.addView(inputName)
        layout.addView(inputPopulation)

        AlertDialog.Builder(this)
            .setTitle("Modificar población")
            .setView(layout)
            .setPositiveButton("Guardar") { _, _ ->
                val name = inputName.text.toString()
                val pop = inputPopulation.text.toString().toIntOrNull()
                if (pop != null) {
                    val success = dbHelper.updatePopulationByName(name, pop)
                    if (success) {
                        Toast.makeText(this, "Población actualizada", Toast.LENGTH_SHORT).show()
                        refreshList()
                    } else {
                        Toast.makeText(this, "Ciudad no encontrada", Toast.LENGTH_SHORT).show()
                    }
                }
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }
}
