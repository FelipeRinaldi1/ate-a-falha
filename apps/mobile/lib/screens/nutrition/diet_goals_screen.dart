import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/nutrition_provider.dart';

class DietGoalsScreen extends StatefulWidget {
  const DietGoalsScreen({super.key});

  @override
  State<DietGoalsScreen> createState() => _DietGoalsScreenState();
}

class _DietGoalsScreenState extends State<DietGoalsScreen> {
  final _formKey = GlobalKey<FormState>();
  final _kcalController = TextEditingController();
  final _proteinController = TextEditingController();
  final _carbController = TextEditingController();
  final _fatController = TextEditingController();
  final _fiberController = TextEditingController();
  final _waterController = TextEditingController();

  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final activeDiet = Provider.of<NutritionProvider>(context, listen: false).activeDiet;
      if (activeDiet != null) {
        _kcalController.text = (activeDiet['dailyKcalGoal'] ?? 2000).toString();
        _proteinController.text = (activeDiet['dailyProteinGoal'] ?? 150).toString();
        _carbController.text = (activeDiet['dailyCarbGoal'] ?? 200).toString();
        _fatController.text = (activeDiet['dailyFatGoal'] ?? 60).toString();
        _fiberController.text = (activeDiet['dailyFiberGoal'] ?? 25).toString();
        _waterController.text = (activeDiet['dailyWaterGoal'] ?? 3000).toString();
      } else {
        _kcalController.text = '2000';
        _proteinController.text = '150';
        _carbController.text = '200';
        _fatController.text = '60';
        _fiberController.text = '25';
        _waterController.text = '3000';
      }
    });
  }

  @override
  void dispose() {
    _kcalController.dispose();
    _proteinController.dispose();
    _carbController.dispose();
    _fatController.dispose();
    _fiberController.dispose();
    _waterController.dispose();
    super.dispose();
  }

  void _handleSave(NutritionProvider provider) async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSaving = true;
      });

      final payload = {
        'name': 'Minha Dieta',
        'dailyKcalGoal': int.tryParse(_kcalController.text) ?? 2000,
        'dailyProteinGoal': int.tryParse(_proteinController.text) ?? 150,
        'dailyCarbGoal': int.tryParse(_carbController.text) ?? 200,
        'dailyFatGoal': int.tryParse(_fatController.text) ?? 60,
        'dailyFiberGoal': int.tryParse(_fiberController.text) ?? 25,
        'dailyWaterGoal': int.tryParse(_waterController.text) ?? 3000,
      };

      try {
        final activeDiet = provider.activeDiet;
        if (activeDiet != null) {
          await provider.updateDietGoals(activeDiet['id'].toString(), payload);
        } else {
          await provider.createDiet(payload);
        }

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Metas salvas com sucesso! 🍎'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.pop(context);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Falha ao salvar metas'),
              backgroundColor: Theme.of(context).colorScheme.error,
            ),
          );
        }
      } finally {
        if (mounted) {
          setState(() {
            _isSaving = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<NutritionProvider>(context);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Metas Diárias'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Defina suas Metas Nutricionais',
                style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'Personalize suas necessidades de calorias e macros para alinhar com seus objetivos de treino.',
                style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
              const SizedBox(height: 24),

              // Kcal Target
              TextFormField(
                controller: _kcalController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Meta de Calorias (kcal)',
                  prefixIcon: Icon(Icons.local_fire_department_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe a meta de calorias';
                  if (int.tryParse(value) == null) return 'Informe um valor inteiro válido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Protein Target
              TextFormField(
                controller: _proteinController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Meta de Proteínas (g)',
                  prefixIcon: Icon(Icons.egg_alt_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe a meta de proteínas';
                  if (int.tryParse(value) == null) return 'Informe um valor inteiro válido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Carbohydrates Target
              TextFormField(
                controller: _carbController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Meta de Carboidratos (g)',
                  prefixIcon: Icon(Icons.bakery_dining_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe a meta de carboidratos';
                  if (int.tryParse(value) == null) return 'Informe um valor inteiro válido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Fats Target
              TextFormField(
                controller: _fatController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Meta de Gorduras (g)',
                  prefixIcon: Icon(Icons.water_drop_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe a meta de gorduras';
                  if (int.tryParse(value) == null) return 'Informe um valor inteiro válido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Fiber Target
              TextFormField(
                controller: _fiberController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Meta de Fibras (g)',
                  prefixIcon: Icon(Icons.eco_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe a meta de fibras';
                  if (int.tryParse(value) == null) return 'Informe um valor inteiro válido';
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // Water Target
              TextFormField(
                controller: _waterController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(
                  labelText: 'Meta de Consumo de Água (ml)',
                  prefixIcon: Icon(Icons.local_drink_outlined),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Informe a meta de água';
                  if (int.tryParse(value) == null) return 'Informe um valor inteiro válido';
                  return null;
                },
              ),
              const SizedBox(height: 32),

              // Save Button
              ElevatedButton(
                onPressed: _isSaving ? null : () => _handleSave(provider),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                ),
                child: _isSaving
                    ? const CircularProgressIndicator()
                    : const Text('Salvar Metas', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
