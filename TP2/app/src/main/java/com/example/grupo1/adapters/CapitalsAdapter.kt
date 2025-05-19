package com.example.grupo1.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.example.grupo1.databinding.ItemCapitalBinding
import com.example.grupo1.models.Capital

class CapitalsAdapter(
    private val capitals: List<Capital>,
    private val onItemClick: (Capital) -> Unit
) : RecyclerView.Adapter<CapitalsAdapter.CapitalViewHolder>() {

    inner class CapitalViewHolder(private val binding: ItemCapitalBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(capital: Capital) {
            binding.tvCountry.text = capital.country
            binding.tvCapital.text = capital.capitalName

            // Formateamos la población con separadores de miles
            val formattedPopulation = "%,d".format(capital.population)
            binding.tvPopulation.text = "Población: $formattedPopulation"

            // Click del item
            binding.root.setOnClickListener {
                onItemClick(capital)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CapitalViewHolder {
        val binding = ItemCapitalBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return CapitalViewHolder(binding)
    }

    override fun onBindViewHolder(holder: CapitalViewHolder, position: Int) {
        holder.bind(capitals[position])
    }

    override fun getItemCount(): Int = capitals.size
}
