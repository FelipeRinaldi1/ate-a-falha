import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/workout_provider.dart';
import 'exercise_search_screen.dart';
import 'exercise_details_screen.dart';
import 'active_workout_screen.dart';

class WorkoutTab extends StatefulWidget {
  const WorkoutTab({super.key});

  @override
  State<WorkoutTab> createState() => _WorkoutTabState();
}

class _WorkoutTabState extends State<WorkoutTab> {
  DateTime _selectedDate = DateTime.now();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final workoutProvider = Provider.of<WorkoutProvider>(context, listen: false);
      workoutProvider.fetchPlans();
      workoutProvider.fetchExerciseCatalog();
    });
  }

  // Generate surrounding 7 days based on selectedDate
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

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final workoutProvider = Provider.of<WorkoutProvider>(context);

    final activePlan = workoutProvider.activePlan;
    
    // JS: Sunday = 0, Monday = 1, ... Saturday = 6.
    // Dart: Monday = 1, ... Saturday = 6, Sunday = 7.
    final selectedWeekDayStr = (_selectedDate.weekday == 7 ? 0 : _selectedDate.weekday).toString();
    
    dynamic todaysWorkout;
    if (activePlan != null && activePlan['workouts'] != null) {
      final workouts = activePlan['workouts'] as List<dynamic>;
      todaysWorkout = workouts.firstWhere(
        (w) => w['weekDay'] == selectedWeekDayStr,
        orElse: () => null,
      );
    }

    final String apiBaseUrl = 'http://10.0.2.2:3333/api/v1'; // Default API base URL

    return Scaffold(
      appBar: AppBar(
        title: const Text('Treino', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.search_outlined),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => const ExerciseSearchScreen()),
              );
            },
          ),
        ],
      ),
      body: workoutProvider.isLoadingPlans && workoutProvider.plans.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                await workoutProvider.fetchPlans();
                await workoutProvider.fetchExerciseCatalog();
              },
              child: ListView(
                padding: const EdgeInsets.all(16.0),
                children: [
                  // Week Calendar Day Selector
                  _buildCalendarSelector(theme),
                  const SizedBox(height: 20),

                  // Ficha de Treino Principal Banner
                  Text(
                    'Ficha de Treino Principal',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 10),
                  
                  if (activePlan != null) ...[
                    Card(
                      clipBehavior: Clip.antiAlias,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Cover Image
                          Container(
                            height: 120,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [theme.colorScheme.primary.withOpacity(0.8), theme.colorScheme.secondary.withOpacity(0.8)],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                            ),
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                if (activePlan['coverImageUrl'] != null)
                                  Image.network(
                                    activePlan['coverImageUrl'].toString().startsWith('http')
                                        ? activePlan['coverImageUrl'].toString()
                                        : '$apiBaseUrl/assets/exercises/${activePlan['coverImageUrl'].toString().endsWith('.webp') ? activePlan['coverImageUrl'] : activePlan['coverImageUrl'].toString().replaceAll(RegExp(r'\.[^/.]+$'), '.webp')}',
                                    fit: BoxFit.cover,
                                    errorBuilder: (_, __, ___) => Container(color: Colors.transparent),
                                  ),
                                Container(
                                  color: Colors.black.withOpacity(0.35),
                                ),
                                Positioned(
                                  bottom: 16,
                                  left: 16,
                                  right: 16,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        activePlan['name'] ?? 'Sem nome',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Text(
                                        '${activePlan['workouts']?.length ?? 0} divisões de treino',
                                        style: TextStyle(
                                          color: Colors.white.withOpacity(0.8),
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Positioned(
                                  top: 12,
                                  right: 12,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: theme.colorScheme.primary,
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Text(
                                      'Ativa',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          
                          // Workout Action
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: [
                                if (todaysWorkout != null) ...[
                                  Text(
                                    'Treino sugerido para hoje: ${todaysWorkout['day']}',
                                    style: const TextStyle(fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 12),
                                  ElevatedButton.icon(
                                    onPressed: () {
                                      Navigator.of(context).push(
                                        MaterialPageRoute(
                                          builder: (_) => ActiveWorkoutScreen(
                                            planId: activePlan['id'],
                                            workoutId: todaysWorkout['id'],
                                            workoutName: todaysWorkout['day'],
                                          ),
                                        ),
                                      );
                                    },
                                    icon: const Icon(Icons.play_arrow),
                                    label: Text('Começar Treino (${todaysWorkout['day']})'),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: theme.colorScheme.primary,
                                      foregroundColor: theme.colorScheme.onPrimary,
                                    ),
                                  ),
                                ] else ...[
                                  const Text(
                                    'Nenhum treino agendado para hoje.',
                                    style: TextStyle(fontStyle: FontStyle.italic),
                                  ),
                                  const SizedBox(height: 12),
                                  OutlinedButton.icon(
                                    onPressed: () {
                                      // Redirect to select active workout
                                    },
                                    icon: const Icon(Icons.fitness_center),
                                    label: const Text('Escolher treino manualmente'),
                                  ),
                                ],
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ] else ...[
                    Card(
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        side: BorderSide(color: theme.colorScheme.outlineVariant),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          children: [
                            Icon(Icons.fitness_center, size: 48, color: theme.colorScheme.outline),
                            const SizedBox(height: 12),
                            const Text('Nenhum plano de treino ativo'),
                            const SizedBox(height: 12),
                            ElevatedButton(
                              onPressed: () {},
                              child: const Text('Criar Ficha de Treino'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                  const SizedBox(height: 24),

                  // Outros Planos
                  if (workoutProvider.plans.length > 1) ...[
                    Text(
                      'Minhas Fichas de Treino',
                      style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    SizedBox(
                      height: 140,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: workoutProvider.plans.length,
                        itemBuilder: (context, index) {
                          final plan = workoutProvider.plans[index];
                          final isPlanActive = plan['isActive'] == true;
                          return Container(
                            width: 140,
                            margin: const EdgeInsets.only(right: 12),
                            child: Card(
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                side: BorderSide(
                                  color: isPlanActive ? theme.colorScheme.primary : theme.colorScheme.outlineVariant,
                                  width: isPlanActive ? 2 : 1,
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: InkWell(
                                onTap: () {
                                  // Navigate to select active workout screen
                                },
                                borderRadius: BorderRadius.circular(12),
                                child: Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        plan['name'] ?? '',
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(fontWeight: FontWeight.bold),
                                      ),
                                      const Spacer(),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: isPlanActive ? theme.colorScheme.primaryContainer : theme.colorScheme.surfaceVariant,
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          isPlanActive ? 'Ativa' : 'Ficha',
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: isPlanActive ? theme.colorScheme.onPrimaryContainer : theme.colorScheme.onSurfaceVariant,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],

                  // Exercise Catalog Selector Preview
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Exercícios',
                        style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(builder: (_) => const ExerciseSearchScreen()),
                          );
                        },
                        child: const Text('Ver todos'),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),

                  // Horizontal Exercises Slider
                  if (workoutProvider.isLoadingExercises && workoutProvider.exercises.isEmpty)
                    const Center(child: CircularProgressIndicator())
                  else if (workoutProvider.exercises.isNotEmpty)
                    SizedBox(
                      height: 170,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: workoutProvider.exercises.length,
                        itemBuilder: (context, index) {
                          final exercise = workoutProvider.exercises[index];
                          final images = exercise['images'] as List<dynamic>?;
                          final String? imagePath = images != null && images.isNotEmpty ? images[0].toString() : null;
                          final exerciseImageUrl = imagePath != null
                              ? '$apiBaseUrl/assets/exercises/${imagePath.endsWith('.webp') ? imagePath : imagePath.replaceAll(RegExp(r'\.[^/.]+$'), '.webp')}'
                              : 'https://placehold.co/120x120?text=Exerc%C3%ADcio';

                          return Container(
                            width: 140,
                            margin: const EdgeInsets.only(right: 12),
                            child: Card(
                              clipBehavior: Clip.antiAlias,
                              child: InkWell(
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => ExerciseDetailsScreen(exerciseId: exercise['id']),
                                    ),
                                  );
                                },
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.stretch,
                                  children: [
                                    Image.network(
                                      exerciseImageUrl,
                                      height: 90,
                                      fit: BoxFit.cover,
                                      errorBuilder: (_, __, ___) => Container(
                                        height: 90,
                                        color: theme.colorScheme.surfaceVariant,
                                        child: const Icon(Icons.fitness_center),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            exercise['name'] ?? '',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            (exercise['primaryMuscles'] as List<dynamic>?)?.first?.toString() ?? '',
                                            style: TextStyle(
                                              fontSize: 10,
                                              color: theme.colorScheme.primary,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    )
                  else
                    const Text('Nenhum exercício catalogado'),
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
}
