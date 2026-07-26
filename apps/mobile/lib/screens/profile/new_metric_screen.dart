import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/profile_provider.dart';

class NewMetricScreen extends StatefulWidget {
  const NewMetricScreen({super.key});

  @override
  State<NewMetricScreen> createState() => _NewMetricScreenState();
}

class _NewMetricScreenState extends State<NewMetricScreen> {
  final _formKey = GlobalKey<FormState>();
  final _weightController = TextEditingController();
  final _heightController = TextEditingController();
  final _fatController = TextEditingController();
  final _muscleController = TextEditingController();
  
  int _activityLevel = 0; // 0: Sedentary, 1: Light, 2: Moderate, 3: Intense, 4: Very intense
  bool _isSaving = false;

  @override
  void dispose() {
    _weightController.dispose();
    _heightController.dispose();
    _fatController.dispose();
    _muscleController.dispose();
    super.dispose();
  }

  void _handleSave(ProfileProvider provider) async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSaving = true;
      });

      final weight = double.tryParse(_weightController.text) ?? 0.0;
      final height = double.tryParse(_heightController.text) ?? 0.0;
      final bodyFat = double.tryParse(_fatController.text);
      final muscleRate = double.tryParse(_muscleController.text);

      final success = await provider.addMetric(
        weight: weight,
        height: height,
        activityLevel: _activityLevel,
        bodyFat: bodyFat,
        muscleRate: muscleRate,
      );

      if (mounted) {
        setState(() {
          _isSaving = false;
        });

        if (success) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Registro corporal adicionado com sucesso! 📈'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context, true);
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(provider.errorMessage ?? 'Falha ao salvar métrica'),
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileProvider = Provider.of<ProfileProvider>(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Registrar Peso'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Novas Métricas Corporais',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Insira os dados atuais para atualizar seu IMC e histórico de progresso.',
                style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
              const SizedBox(height: 24),

              // Height
              TextFormField(
                controller: _heightController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Altura (cm)',
                  prefixIcon: Icon(Icons.height_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe a altura';
                  if (double.tryParse(value) == null) return 'Informe um valor numérico válido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Weight
              TextFormField(
                controller: _weightController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Peso (kg)',
                  prefixIcon: Icon(Icons.monitor_weight_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe o peso';
                  if (double.tryParse(value) == null) return 'Informe um valor numérico válido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Activity Level
              DropdownButtonFormField<int>(
                value: _activityLevel,
                decoration: const InputDecoration(
                  labelText: 'Nível de Atividade',
                  prefixIcon: Icon(Icons.directions_run_outlined),
                ),
                items: const [
                  DropdownMenuItem(value: 0, child: Text('Sedentário')),
                  DropdownMenuItem(value: 1, child: Text('Leve')),
                  DropdownMenuItem(value: 2, child: Text('Moderado')),
                  DropdownMenuItem(value: 3, child: Text('Intenso')),
                  DropdownMenuItem(value: 4, child: Text('Muito Intenso')),
                ],
                onChanged: (val) {
                  if (val != null) {
                    setState(() {
                      _activityLevel = val;
                    });
                  }
                },
              ),
              const SizedBox(height: 16),

              // Body Fat (optional)
              TextFormField(
                controller: _fatController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: '% de Gordura Corporal (opcional)',
                  prefixIcon: Icon(Icons.percent),
                ),
              ),
              const SizedBox(height: 16),

              // Muscle rate (optional)
              TextFormField(
                controller: _muscleController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: '% de Massa Muscular (opcional)',
                  prefixIcon: Icon(Icons.fitness_center),
                ),
              ),
              const SizedBox(height: 32),

              // Save Button
              ElevatedButton(
                onPressed: _isSaving ? null : () => _handleSave(profileProvider),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                child: _isSaving
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Text('Salvar Registro', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
