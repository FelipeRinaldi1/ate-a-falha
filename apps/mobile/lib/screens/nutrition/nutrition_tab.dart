import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/nutrition_provider.dart';
import 'food_search_screen.dart';
import 'meal_details_screen.dart';
import 'diet_goals_screen.dart';

class NutritionTab extends StatefulWidget {
  const NutritionTab({super.key});

  @override
  State<NutritionTab> createState() => _NutritionTabState();
}

class _NutritionTabState extends State<NutritionTab> {
  DateTime _selectedDate = DateTime.now();
  final _mealNameController = TextEditingController();
  final _mealTimeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  void _loadData() async {
    final provider = Provider.of<NutritionProvider>(context, listen: false);
    await provider.fetchDiets();
    await provider.fetchDietLogs();
    if (provider.activeDiet != null) {
      await provider.fetchTargetMeals(provider.activeDiet['id']);
    }
  }

  @override
  void dispose() {
    _mealNameController.dispose();
    _mealTimeController.dispose();
    super.dispose();
  }

  List<DateTime> _getWeekDays() {
    final List<DateTime> days = [];
    final sunday = _selectedDate.subtract(Duration(days: _selectedDate.weekday % 7));
    for (int i = 0; i < 7; i++) {
      days.add(sunday.add(Duration(days: i)));
    }
    return days;
  }

  String _formatDateString(DateTime d) {
    final year = d.year;
    final month = d.month.toString().padLeft(2, '0');
    final day = d.day.toString().padLeft(2, '0');
    return '$year-$month-$day';
  }

  // Helper to calculate active log totals
  Map<String, double> _calculateLoggedMacros(dynamic activeLog) {
    double calories = 0;
    double proteins = 0;
    double carbohydrates = 0;
    double fats = 0;
    double fiber = 0;

    final meals = activeLog?['meals'] as List<dynamic>? ?? [];
    for (var m in meals) {
      final foods = m['foods'] as List<dynamic>? ?? [];
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
    }

    return {
      'calories': calories,
      'proteins': proteins,
      'carbohydrates': carbohydrates,
      'fats': fats,
      'fiber': fiber,
    };
  }

  void _showAddMealDialog(dynamic activeLog, NutritionProvider provider) {
    _mealNameController.clear();
    _mealTimeController.text = '12:00';

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Adicionar Refeição'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _mealNameController,
              decoration: const InputDecoration(
                labelText: 'Nome da Refeição',
                hintText: 'Ex: Lanche da Tarde',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _mealTimeController,
              decoration: const InputDecoration(
                labelText: 'Horário',
                hintText: 'Ex: 15:30',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (_mealNameController.text.trim().isEmpty) return;
              Navigator.pop(context);

              String? dietLogId = activeLog?['id']?.toString();
              if (dietLogId == null) {
                final dateStr = _formatDateString(_selectedDate);
                final newLog = await provider.createDietLog(dateStr);
                dietLogId = newLog['id']?.toString();
              }

              if (dietLogId != null) {
                await provider.addMealLog(
                  dietLogId,
                  _mealNameController.text.trim(),
                  _mealTimeController.text.trim(),
                  activeLog?['meals']?.length ?? 0,
                );
              }
            },
            child: const Text('Adicionar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final provider = Provider.of<NutritionProvider>(context);

    final selectedDateStr = _formatDateString(_selectedDate);

    // Find active log for selected date
    dynamic activeLog;
    for (var log in provider.dietLogs) {
      final String rawDate = log['date'].toString();
      final logDateStr = rawDate.substring(0, 10);
      if (logDateStr == selectedDateStr) {
        activeLog = log;
        break;
      }
    }

    final activeDiet = provider.activeDiet;
    final loggedMacros = _calculateLoggedMacros(activeLog);

    final double targetKcal = (activeDiet?['dailyKcalGoal'] as num? ?? 2000).toDouble();
    final double targetProtein = (activeDiet?['dailyProteinGoal'] as num? ?? 150).toDouble();
    final double targetCarb = (activeDiet?['dailyCarbGoal'] as num? ?? 200).toDouble();
    final double targetFat = (activeDiet?['dailyFatGoal'] as num? ?? 60).toDouble();
    final double targetFiber = (activeDiet?['dailyFiberGoal'] as num? ?? 25).toDouble();
    final int targetWater = activeDiet?['dailyWaterGoal'] as int? ?? 3000;
    final int currentWater = activeLog?['waterIntake'] as int? ?? 0;

    final meals = activeLog?['meals'] as List<dynamic>? ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dieta', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const FoodSearchScreen()),
              );
            },
          ),
        ],
      ),
      body: provider.isLoadingDiets && provider.diets.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                _loadData();
              },
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Calendar day selector
                  _buildCalendarSelector(theme),
                  const SizedBox(height: 16),

                  // Water Card
                  _buildWaterCard(currentWater, targetWater, activeLog, provider, theme),
                  const SizedBox(height: 16),

                  // Macros Summary Card
                  _buildMacrosSummaryCard(loggedMacros, targetKcal, targetProtein, targetCarb, targetFat, targetFiber, activeDiet, theme),
                  const SizedBox(height: 24),

                  // Meals Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Refeições',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      TextButton.icon(
                        onPressed: () => _showAddMealDialog(activeLog, provider),
                        icon: const Icon(Icons.add),
                        label: const Text('Nova Refeição'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Meals List
                  if (meals.isEmpty)
                    Card(
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        side: BorderSide(color: theme.colorScheme.outlineVariant),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: const Padding(
                        padding: EdgeInsets.all(24.0),
                        child: Center(
                          child: Text('Nenhuma refeição registrada para hoje.'),
                        ),
                      ),
                    )
                  else
                    ...meals.map((meal) {
                      double mealKcal = 0;
                      final foods = meal['foods'] as List<dynamic>? ?? [];
                      for (var f in foods) {
                        final qty = f['quantity'] as num? ?? 0;
                        final details = f['food'];
                        if (details != null) {
                          mealKcal += ((details['calories'] as num? ?? 0) * (qty / 100.0));
                        }
                      }

                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          side: BorderSide(color: theme.colorScheme.outlineVariant),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: ListTile(
                          title: Text(
                            meal['name'] ?? '',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          subtitle: Text(
                            '${foods.length} itens • ${mealKcal.toStringAsFixed(0)} kcal',
                          ),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => MealDetailsScreen(
                                  mealLogId: meal['id'].toString(),
                                  mealName: meal['name'] ?? '',
                                ),
                              ),
                            );
                          },
                        ),
                      );
                    }),
                ],
              ),
            ),
    );
  }

  Widget _buildCalendarSelector(ThemeData theme) {
    final weekDays = _getWeekDays();
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: theme.colorScheme.outlineVariant),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: weekDays.map((day) {
            final isSelected = day.day == _selectedDate.day &&
                day.month == _selectedDate.month &&
                day.year == _selectedDate.year;

            final dayLabel = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][day.weekday % 7];

            return InkWell(
              onTap: () {
                setState(() {
                  _selectedDate = day;
                });
              },
              borderRadius: BorderRadius.circular(12),
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                decoration: BoxDecoration(
                  color: isSelected ? theme.colorScheme.primary : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  children: [
                    Text(
                      dayLabel,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      day.day.toString(),
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? theme.colorScheme.onPrimary : theme.colorScheme.onSurface,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildWaterCard(int current, int target, dynamic activeLog, NutritionProvider provider, ThemeData theme) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: theme.colorScheme.outlineVariant),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            const Icon(Icons.local_drink, size: 40, color: Colors.blue),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Água', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text(
                    '$current / $target ml',
                    style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold, color: Colors.blue),
                  ),
                ],
              ),
            ),
            Row(
              children: [
                IconButton.filledTonal(
                  icon: const Icon(Icons.remove),
                  onPressed: () async {
                    if (activeLog != null) {
                      await provider.updateDietLogWater(activeLog['id'].toString(), -250);
                    }
                  },
                ),
                const SizedBox(width: 4),
                IconButton.filledTonal(
                  icon: const Icon(Icons.add),
                  onPressed: () async {
                    String? dietLogId = activeLog?['id']?.toString();
                    if (dietLogId == null) {
                      final dateStr = _formatDateString(_selectedDate);
                      final newLog = await provider.createDietLog(dateStr);
                      dietLogId = newLog['id']?.toString();
                    }
                    if (dietLogId != null) {
                      await provider.updateDietLogWater(dietLogId, 250);
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMacrosSummaryCard(
    Map<String, double> logged,
    double targetKcal,
    double targetProt,
    double targetCarb,
    double targetFat,
    double targetFiber,
    dynamic activeDiet,
    ThemeData theme,
  ) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: theme.colorScheme.outlineVariant),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Calorias & Macronutrientes', style: TextStyle(fontWeight: FontWeight.bold)),
                IconButton(
                  icon: const Icon(Icons.edit_outlined),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const DietGoalsScreen()),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),
            
            // Kcal Progress
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Calorias'),
                Text('${logged['calories']!.toStringAsFixed(0)} / ${targetKcal.toStringAsFixed(0)} kcal'),
              ],
            ),
            const SizedBox(height: 4),
            LinearProgressIndicator(
              value: targetKcal > 0 ? logged['calories']! / targetKcal : 0.0,
              backgroundColor: theme.colorScheme.surfaceVariant,
              color: theme.colorScheme.primary,
              borderRadius: BorderRadius.circular(4),
            ),
            const SizedBox(height: 16),

            // Macros Row
            Row(
              children: [
                Expanded(child: _buildMacroMiniIndicator('Proteínas', logged['proteins']!, targetProt, Colors.red, theme)),
                const SizedBox(width: 8),
                Expanded(child: _buildMacroMiniIndicator('Carbos', logged['carbohydrates']!, targetCarb, Colors.amber, theme)),
                const SizedBox(width: 8),
                Expanded(child: _buildMacroMiniIndicator('Gorduras', logged['fats']!, targetFat, Colors.blue, theme)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMacroMiniIndicator(String label, double current, double target, Color color, ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Text('${current.toStringAsFixed(0)}/${target.toStringAsFixed(0)}g', style: const TextStyle(fontSize: 10)),
        const SizedBox(height: 4),
        LinearProgressIndicator(
          value: target > 0 ? current / target : 0.0,
          backgroundColor: theme.colorScheme.surfaceVariant,
          color: color,
          borderRadius: BorderRadius.circular(4),
        ),
      ],
    );
  }
}
