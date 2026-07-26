import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../api_service.dart';
import '../../providers/nutrition_provider.dart';

class FoodSearchScreen extends StatefulWidget {
  final String? mealLogId;
  final String? mealId;

  const FoodSearchScreen({
    super.key,
    this.mealLogId,
    this.mealId,
  });

  @override
  State<FoodSearchScreen> createState() => _FoodSearchScreenState();
}

class _FoodSearchScreenState extends State<FoodSearchScreen> {
  final ApiService _apiService = ApiService();
  final TextEditingController _searchController = TextEditingController();
  Timer? _debounce;

  String _searchQuery = '';
  String _foodScope = 'all'; // 'all' | 'mine'
  String? _sortBy; // 'high-protein' | 'low-kcal' | 'high-carb' | 'low-fat'

  List<dynamic> _foods = [];
  bool _isLoading = false;

  // Add portion state
  dynamic _selectedFood;
  final TextEditingController _portionController = TextEditingController(text: '100');

  @override
  void initState() {
    super.initState();
    _fetchFoods();
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _searchController.dispose();
    _portionController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () {
      setState(() {
        _searchQuery = query;
      });
      _fetchFoods();
    });
  }

  Future<void> _fetchFoods() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await _apiService.dio.get('/nutrition/food-catalog', queryParameters: {
        'name': _searchQuery.isNotEmpty ? _searchQuery : null,
        'take': 100,
      });

      if (response.statusCode == 200) {
        setState(() {
          _foods = response.data;
        });
      }
    } catch (e) {
      // Handle error
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  List<dynamic> _getProcessedFoods(dynamic currentUser) {
    List<dynamic> result = List.from(_foods);

    // Scope filter
    if (_foodScope == 'mine' && currentUser != null) {
      result = result.where((f) => f['userId'] == currentUser['id']).toList();
    }

    // Sort sorting
    if (_sortBy == 'high-protein') {
      result.sort((a, b) => (b['protein'] as num).compareTo(a['protein'] as num));
    } else if (_sortBy == 'low-kcal') {
      result.sort((a, b) => (a['calories'] as num).compareTo(b['calories'] as num));
    } else if (_sortBy == 'high-carb') {
      result.sort((a, b) => (b['carbohydrate'] as num).compareTo(a['carbohydrate'] as num));
    } else if (_sortBy == 'low-fat') {
      result.sort((a, b) => (a['lipids'] as num).compareTo(b['lipids'] as num));
    }

    return result;
  }

  void _showPortionDialog(dynamic food) {
    setState(() {
      _selectedFood = food;
      _portionController.text = '100';
    });

    showDialog(
      context: context,
      builder: (context) {
        final theme = Theme.of(context);
        return StatefulBuilder(
          builder: (context, setDialogState) {
            final double portion = double.tryParse(_portionController.text) ?? 0.0;
            final double kcal = portion > 0 ? ((_selectedFood['calories'] as num) * portion) / 100 : 0.0;
            final double prot = portion > 0 ? ((_selectedFood['protein'] as num) * portion) / 100 : 0.0;
            final double carb = portion > 0 ? ((_selectedFood['carbohydrate'] as num) * portion) / 100 : 0.0;
            final double fats = portion > 0 ? ((_selectedFood['lipids'] as num) * portion) / 100 : 0.0;
            final double fiber = portion > 0 ? ((_selectedFood['fiber'] as num) * portion) / 100 : 0.0;

            return AlertDialog(
              title: Text('Adicionar ${_selectedFood['name']}'),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Informe a quantidade consumida para calcular e adicionar as calorias e macronutrientes.',
                    style: TextStyle(fontSize: 13),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _portionController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Quantidade consumida (g)',
                    ),
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
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancelar'),
                ),
                ElevatedButton(
                  onPressed: portion <= 0
                      ? null
                      : () async {
                          Navigator.pop(context);
                          final nutritionProvider = Provider.of<NutritionProvider>(context, listen: false);
                          
                          try {
                            if (widget.mealId != null) {
                              await _apiService.dio.post('/nutrition/meals/${widget.mealId}/foods', data: {
                                'foodId': _selectedFood['id'],
                                'quantity': portion,
                              });
                            } else if (widget.mealLogId != null) {
                              await _apiService.dio.post('/nutrition/meal-logs/${widget.mealLogId}/foods', data: {
                                'foodId': _selectedFood['id'],
                                'quantity': portion,
                              });
                            }
                            
                            await nutritionProvider.fetchDietLogs();
                            
                            if (mounted) {
                              Navigator.pop(context); // Go back to Meal details or search
                            }
                          } catch (e) {
                            // Error handling
                          }
                        },
                  child: const Text('Adicionar'),
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
    
    // We can fetch user details from an AuthProvider if needed
    final user = {'id': 'temp-user'}; // Fallback or dynamic fetch

    final processedFoods = _getProcessedFoods(user);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Procurar Alimento'),
      ),
      body: Column(
        children: [
          // Search box & Filters
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: _onSearchChanged,
                  decoration: InputDecoration(
                    hintText: 'Pesquisar...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 12),
                
                // Scope segment selector
                Row(
                  children: [
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('Todos')),
                        selected: _foodScope == 'all',
                        onSelected: (selected) {
                          if (selected) {
                            setState(() {
                              _foodScope = 'all';
                            });
                          }
                        },
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: ChoiceChip(
                        label: const Center(child: Text('Meus Alimentos')),
                        selected: _foodScope == 'mine',
                        onSelected: (selected) {
                          if (selected) {
                            setState(() {
                              _foodScope = 'mine';
                            });
                          }
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Sort Dropdown
                DropdownButtonFormField<String>(
                  value: _sortBy,
                  decoration: InputDecoration(
                    labelText: 'Ordenar por...',
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  items: const [
                    DropdownMenuItem(value: null, child: Text('Relevância')),
                    DropdownMenuItem(value: 'high-protein', child: Text('Mais Proteína')),
                    DropdownMenuItem(value: 'high-carb', child: Text('Mais Carboidrato')),
                    DropdownMenuItem(value: 'low-fat', child: Text('Menos Gordura')),
                    DropdownMenuItem(value: 'low-kcal', child: Text('Menos Calorias')),
                  ],
                  onChanged: (val) {
                    setState(() {
                      _sortBy = val;
                    });
                  },
                ),
              ],
            ),
          ),

          // Total label
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Exibindo ${processedFoods.length} alimentos',
                style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Food List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : processedFoods.isEmpty
                    ? const Center(child: Text('Nenhum alimento catalogado'))
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        itemCount: processedFoods.length,
                        itemBuilder: (context, index) {
                          final food = processedFoods[index];
                          final double kcal = (food['calories'] as num? ?? 0).toDouble();
                          final double prot = (food['protein'] as num? ?? 0).toDouble();
                          final double carb = (food['carbohydrate'] as num? ?? 0).toDouble();
                          final double fats = (food['lipids'] as num? ?? 0).toDouble();
                          final double fiber = (food['fiber'] as num? ?? 0).toDouble();

                          return Card(
                            margin: const EdgeInsets.only(bottom: 12),
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              side: BorderSide(color: theme.colorScheme.outlineVariant),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: ListTile(
                              title: Text(food['name'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold)),
                              subtitle: Padding(
                                padding: const EdgeInsets.only(top: 8.0),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                                  children: [
                                    _buildMacroMini('Kcal', kcal.toStringAsFixed(0), theme.colorScheme.onSurface),
                                    _buildMacroMini('Prot', '${prot.toStringAsFixed(1)}g', Colors.red),
                                    _buildMacroMini('Carb', '${carb.toStringAsFixed(1)}g', Colors.amber),
                                    _buildMacroMini('Gord', '${fats.toStringAsFixed(1)}g', Colors.blue),
                                  ],
                                ),
                              ),
                              trailing: const Icon(Icons.add_circle_outline),
                              onTap: () => _showPortionDialog(food),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }
}
