import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../api_service.dart';
import '../../providers/nutrition_provider.dart';
import 'food_search_screen.dart';

class MealDetailsScreen extends StatefulWidget {
  final String mealLogId;
  final String mealName;

  const MealDetailsScreen({
    super.key,
    required this.mealLogId,
    required this.mealName,
  });

  @override
  State<MealDetailsScreen> createState() => _MealDetailsScreenState();
}

class _MealDetailsScreenState extends State<MealDetailsScreen> {
  final ApiService _apiService = ApiService();
  final _editNameController = TextEditingController();
  final _editTimeController = TextEditingController();
  final _editQuantityController = TextEditingController();

  dynamic _meal;
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchMealDetails();
  }

  @override
  void dispose() {
    _editNameController.dispose();
    _editTimeController.dispose();
    _editQuantityController.dispose();
    super.dispose();
  }

  Future<void> _fetchMealDetails() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _apiService.dio.get('/nutrition/meal-logs/${widget.mealLogId}');
      if (response.statusCode == 200) {
        setState(() {
          _meal = response.data;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Falha ao buscar refeição';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Erro ao se conectar com o servidor';
        _isLoading = false;
      });
    }
  }

  // Calculate totals helper
  Map<String, double> _calculateMealTotals() {
    double calories = 0;
    double proteins = 0;
    double carbohydrates = 0;
    double fats = 0;
    double fiber = 0;

    final foods = _meal?['foods'] as List<dynamic>? ?? [];
    for (var f in foods) {
      final qty = f['quantity'] as num? ?? 0;
      final details = f['food'];
      if (details != null) {
        final factor = qty / 100.0;
        calories += (details['calories'] as num? ?? 0) * factor;
        proteins += (details['proteins'] as num? ?? 0) * factor;
        carbohydrates += (details['carbohydrates'] as num? ?? 0) * factor;
        fats += (details['fats'] as num? ?? 0) * factor;
        fiber += (details['fiber'] as num? ?? 0) * factor;
      }
    }

    return {
      'calories': calories,
      'proteins': proteins,
      'carbohydrates': carbohydrates,
      'fats': fats,
      'fiber': fiber,
    };
  }

  void _showEditMealDialog(NutritionProvider provider) {
    if (_meal == null) return;
    _editNameController.text = _meal['name'] ?? '';
    _editTimeController.text = _meal['time'] ?? '';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Editar Refeição'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _editNameController,
              decoration: const InputDecoration(labelText: 'Nome da Refeição'),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _editTimeController,
              decoration: const InputDecoration(labelText: 'Horário'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _confirmDeleteMeal(provider);
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Excluir'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await _apiService.dio.patch('/nutrition/meal-logs/${widget.mealLogId}', data: {
                  'name': _editNameController.text.trim(),
                  'time': _editTimeController.text.trim(),
                });
                await provider.fetchDietLogs();
                _fetchMealDetails();
              } catch (e) {
                // handle error
              }
            },
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
  }

  void _confirmDeleteMeal(NutritionProvider provider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Excluir Refeição'),
        content: const Text('Tem certeza que deseja excluir esta refeição permanentemente?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context); // close confirm dialog
              try {
                await provider.removeMealLog(widget.mealLogId);
                if (mounted) {
                  Navigator.pop(context); // return to diet dashboard
                }
              } catch (e) {
                // error
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Excluir'),
          ),
        ],
      ),
    );
  }

  void _confirmRemoveFood(String foodLogId, String foodName, NutritionProvider provider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remover Alimento'),
        content: Text('Deseja remover "$foodName" desta refeição?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(context);
              try {
                await _apiService.dio.delete('/nutrition/food-logs/$foodLogId');
                await provider.fetchDietLogs();
                _fetchMealDetails();
              } catch (e) {
                // error
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, foregroundColor: Colors.white),
            child: const Text('Remover'),
          ),
        ],
      ),
    );
  }

  void _showEditFoodDialog(dynamic foodLog, NutritionProvider provider) {
    _editQuantityController.text = foodLog['quantity'].toString();

    showDialog(
      context: context,
      builder: (context) {
        final theme = Theme.of(context);
        return StatefulBuilder(
          builder: (context, setDialogState) {
            final double portion = double.tryParse(_editQuantityController.text) ?? 0.0;
            final details = foodLog['food'];
            final double kcal = portion > 0 ? ((details['calories'] as num) * portion) / 100 : 0.0;
            final double prot = portion > 0 ? ((details['proteins'] as num) * portion) / 100 : 0.0;
            final double carb = portion > 0 ? ((details['carbohydrates'] as num) * portion) / 100 : 0.0;
            final double fats = portion > 0 ? ((details['fats'] as num) * portion) / 100 : 0.0;
            final double fiber = portion > 0 ? ((details['fiber'] as num) * portion) / 100 : 0.0;

            return AlertDialog(
              title: Text('Editar ${details['name']}'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  TextField(
                    controller: _editQuantityController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(labelText: 'Quantidade (g)'),
                    onChanged: (val) {
                      setDialogState(() {});
                    },
                  ),
                  const SizedBox(height: 16),
                  if (portion > 0) ...[
                    Card(
                      elevation: 0,
                      color: theme.colorScheme.surfaceVariant.withOpacity(0.5),
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          children: [
                            Text(
                              '${kcal.toStringAsFixed(0)} Kcal',
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildMacroMini('P', '${prot.toStringAsFixed(1)}g', Colors.red),
                                _buildMacroMini('C', '${carb.toStringAsFixed(1)}g', Colors.amber),
                                _buildMacroMini('G', '${fats.toStringAsFixed(1)}g', Colors.blue),
                                _buildMacroMini('F', '${fiber.toStringAsFixed(1)}g', Colors.teal),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancelar')),
                ElevatedButton(
                  onPressed: portion <= 0
                      ? null
                      : () async {
                          Navigator.pop(context);
                          try {
                            await _apiService.dio.patch('/nutrition/food-logs/${foodLog['id']}', data: {
                              'quantity': portion,
                            });
                            await provider.fetchDietLogs();
                            _fetchMealDetails();
                          } catch (e) {
                            // error
                          }
                        },
                  child: const Text('Salvar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildMacroMini(String label, String value, Color color) {
    return Column(
      children: [
        Text(label, style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.bold)),
        Text(value, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = Provider.of<NutritionProvider>(context);

    final totals = _calculateLoggedMacrosSum();

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.mealName),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => _showEditMealDialog(provider),
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text(_errorMessage!))
              : _meal == null
                  ? const Center(child: Text('Refeição não encontrada.'))
                  : Column(
                      children: [
                        // Meal Macro Totals Card
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Card(
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              side: BorderSide(color: theme.colorScheme.outlineVariant),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                children: [
                                  Text(
                                    '${totals['calories']!.toStringAsFixed(0)} Kcal',
                                    style: theme.textTheme.headlineMedium?.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: theme.colorScheme.primary,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                                    children: [
                                      _buildMacroMini('Proteína', '${totals['proteins']!.toStringAsFixed(0)}g', Colors.red),
                                      _buildMacroMini('Carbo', '${totals['carbohydrates']!.toStringAsFixed(0)}g', Colors.amber),
                                      _buildMacroMini('Gordura', '${totals['fats']!.toStringAsFixed(0)}g', Colors.blue),
                                      _buildMacroMini('Fibra', '${totals['fiber']!.toStringAsFixed(0)}g', Colors.teal),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),

                        // Food Items List
                        Expanded(
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16.0),
                            itemCount: (_meal['foods'] as List<dynamic>? ?? []).length,
                            itemBuilder: (context, index) {
                              final item = _meal['foods'][index];
                              final food = item['food'];
                              final qty = (item['quantity'] as num).toDouble();
                              final kcal = ((food['calories'] as num) * qty) / 100;
                              final prot = ((food['protein'] as num) * qty) / 100;
                              final carb = ((food['carbohydrate'] as num) * qty) / 100;
                              final fats = ((food['lipids'] as num) * qty) / 100;

                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  side: BorderSide(color: theme.colorScheme.outlineVariant),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Text(
                                              food['name'] ?? '',
                                              style: const TextStyle(fontWeight: FontWeight.bold),
                                            ),
                                          ),
                                          Text(
                                            '${kcal.toStringAsFixed(0)} kcal',
                                            style: const TextStyle(fontWeight: FontWeight.bold),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        'Porção: ${qty.toStringAsFixed(0)}g',
                                        style: theme.textTheme.bodySmall,
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                                        children: [
                                          _buildMacroMini('P', '${prot.toStringAsFixed(1)}g', Colors.red),
                                          _buildMacroMini('C', '${carb.toStringAsFixed(1)}g', Colors.amber),
                                          _buildMacroMini('G', '${fats.toStringAsFixed(1)}g', Colors.blue),
                                          Row(
                                            children: [
                                              IconButton(
                                                icon: const Icon(Icons.edit, size: 16),
                                                onPressed: () => _showEditFoodDialog(item, provider),
                                              ),
                                              IconButton(
                                                icon: const Icon(Icons.delete, size: 16, color: Colors.red),
                                                onPressed: () => _confirmRemoveFood(item['id'].toString(), food['name'], provider),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),

                        // Add Food Button
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              await Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (_) => FoodSearchScreen(mealLogId: widget.mealLogId),
                                ),
                              );
                              _fetchMealDetails();
                            },
                            icon: const Icon(Icons.add),
                            label: const Text('Adicionar Alimento'),
                            style: ElevatedButton.styleFrom(
                              minimumSize: const Size.fromHeight(50),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                            ),
                          ),
                        ),
                      ],
                    ),
    );
  }

  Map<String, double> _calculateLoggedMacrosSum() {
    return _calculateDietMacros();
  }

  Map<String, double> _calculateDietMacros() {
    return _calculateMealTotals();
  }
}
